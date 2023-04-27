import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from "typeorm";
import { AppDataSource } from "../data_source";
import { POSTGRESQL_ERROR } from "../constants/postgresql";
import { Blockchain } from "../constants/data.enums";
import { uuidWithPrefix } from "../utils/uuid";

/**
 * Store the information about transactions.
 */
@Entity({ name: "transaction" })
@Index("unique_transaction", ["transactionHash", "blockchain"], { unique: true })
export class Transaction {
  @PrimaryColumn({ name: "id", type: "text", update: false })
  id: string;

  // address of source account
  @Column({ name: "from", type: "text", update: false })
  from: string;

  // address of destination account
  @Column({ name: "to", type: "text", update: false })
  to: string;

  // the amount that was sent
  @Column({ name: "amount", type: "bigint", update: false })
  amount: number;

  // hash of the transaction
  @Column({ name: "transaction_hash", type: "text", update: false })
  transactionHash: string;

  @Column({ name: "blockchain", type: "text", update: false })
  blockchain: Blockchain;

  @Column({ name: "gas", type: "bigint", update: false })
  gas: number;

  @Column({ name: "gas_price", type: "bigint", update: false })
  gasPrice: number;

  // this is the price of the native token in USD
  @Column({ name: "native_token_price", type: "bigint", update: false, nullable: true })
  nativeTokenPrice?: number;

  @Column({ type: "timestamptz", name: "created_at", update: false })
  createdAt: Date;

  @BeforeInsert()
  // @ts-ignore
  private beforeInsert() {
    this.validate();
    this.generateUuid();
  }

  generateUuid(): void {
    this.id = uuidWithPrefix(true, "app");
  }

  async validate(): Promise<void> {
    this.transactionHash = this.transactionHash?.trim()?.toLocaleLowerCase();
  }

  equal(transactionHash: string, blockchain: Blockchain): boolean {
    return this.transactionHash == transactionHash && this.blockchain == blockchain;
  }

  static async create(
    from: string,
    to: string,
    amount: number,
    transactionHash: string,
    gas: number,
    gasPrice: number,
    createdAt: Date
  ): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.blockchain = Blockchain.ETHEREUM;
    transaction.from = from;
    transaction.to = to;
    transaction.amount = amount;
    transaction.transactionHash = transactionHash;
    transaction.gas = gas;
    transaction.gasPrice = gasPrice;
    transaction.createdAt = createdAt;

    const insertResult = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Transaction)
      .values(transaction)
      .orIgnore()
      .returning("*")
      .execute();

    if ((insertResult.raw as Array<Transaction>).length == 0) {
      const collidingEntry = await AppDataSource.getRepository(Transaction).findOne({
        where: { transactionHash, blockchain: Blockchain.ETHEREUM },
      });
      if (collidingEntry?.equal(transactionHash, Blockchain.ETHEREUM)) {
        return collidingEntry;
      } else {
        throw {
          code: POSTGRESQL_ERROR.UNIQUE_VIOLATION,
          constraint: "unique_application",
          message: 'duplicate key value violates unique constraint "unique_application"',
        };
      }
    }

    return transaction;
  }
}
