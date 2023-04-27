import { Blockchain } from "../../constants/data.enums";
import { Transaction } from "../../data/transaction";
import { AppDataSource } from "../../data_source";
import { uuid } from "../../utils/uuid";

describe("Transaction", () => {
  describe("create", () => {
    const blockchain = Blockchain.ETHEREUM;
    const from = uuid()
    const to = uuid()
    const amount = Math.floor(Math.random() * 10_000_000);
    const gas = Math.floor(Math.random() * 10_000_000);
    const gasPrice = Math.floor(Math.random() * 10_000_000);
    const createdAt = new Date();

    test("basic -- data is expected", async () => {
      const transactionHash = uuid();
      const transaction = await Transaction.create(
        from,
        to,
        amount,
        transactionHash,
        gas,
        gasPrice,
        createdAt
      );

      const savedTransaction = await AppDataSource.getRepository(Transaction).findOneBy({ id: transaction.id });

      expect(savedTransaction?.id).not.toBeNull();
      expect(savedTransaction?.blockchain).toBe(blockchain);
      expect(savedTransaction?.from).toBe(from);
      expect(savedTransaction?.to).toBe(to);
      expect(savedTransaction?.amount).toBe(amount);
      expect(savedTransaction?.transactionHash).toBe(transactionHash);
      expect(savedTransaction?.gas).toBe(gas);
      expect(savedTransaction?.gasPrice).toBe(gasPrice);
      expect(savedTransaction?.createdAt).toBe(createdAt);
    });

    test("basic -- is idempotent", async () => {
      const transactionHash = uuid();
      const firstCall = await Transaction.create(
        from,
        to,
        amount,
        transactionHash,
        gas,
        gasPrice,
        createdAt
      );

      const savedTransaction = await AppDataSource.getRepository(Transaction).findOneBy({ id: firstCall.id });

      expect(savedTransaction?.id).not.toBeNull();
      expect(savedTransaction?.blockchain).toBe(blockchain);
      expect(savedTransaction?.from).toBe(from);
      expect(savedTransaction?.to).toBe(to);
      expect(savedTransaction?.amount).toBe(amount);
      expect(savedTransaction?.transactionHash).toBe(transactionHash);
      expect(savedTransaction?.gas).toBe(gas);
      expect(savedTransaction?.gasPrice).toBe(gasPrice);
      expect(savedTransaction?.createdAt).toBe(createdAt);

      const secondCall = await Transaction.create(
        from,
        to,
        amount,
        transactionHash,
        gas,
        gasPrice,
        createdAt
      );
      expect(secondCall.id).toBe(savedTransaction?.id);
      expect(secondCall?.blockchain).toBe(blockchain);
      expect(secondCall?.from).toBe(from);
      expect(secondCall?.to).toBe(to);
      expect(secondCall?.amount).toBe(amount);
      expect(secondCall?.transactionHash).toBe(transactionHash);
      expect(secondCall?.gas).toBe(gas);
      expect(secondCall?.gasPrice).toBe(gasPrice);
      expect(secondCall?.createdAt).toBe(createdAt);
    });

    test("basic -- handles collisions", async () => {
      const transactionHash = uuid();
      const firstCall = await Transaction.create(
        from,
        to,
        amount,
        transactionHash,
        gas,
        gasPrice,
        createdAt
      );

      const savedTransaction = await AppDataSource.getRepository(Transaction).findOneBy({ id: firstCall.id });

      expect(savedTransaction?.id).not.toBeNull();
      expect(savedTransaction?.blockchain).toBe(blockchain);
      expect(savedTransaction?.from).toBe(from);
      expect(savedTransaction?.to).toBe(to);
      expect(savedTransaction?.amount).toBe(amount);
      expect(savedTransaction?.transactionHash).toBe(transactionHash);
      expect(savedTransaction?.gas).toBe(gas);
      expect(savedTransaction?.gasPrice).toBe(gasPrice);
      expect(savedTransaction?.createdAt).toBe(createdAt);

      const handleValueCollisions = await Transaction.create(
        from,
        to,
        amount,
        transactionHash,
        gas,
        gasPrice,
        createdAt
      ).catch((err) => {
        expect(err.message).toBe('duplicate key value violates unique constraint "unique_application"');
      });

      expect(handleValueCollisions).toBeUndefined();
    });
  });
});
