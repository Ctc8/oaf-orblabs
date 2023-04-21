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

  @Column({ name: "transaction_hash", type: "text", update: false })
  transactionHash: string;

  @Column({ name: "blockchain", type: "text", update: false })
  blockchain: Blockchain;

  @Column({ name: "amount", type: "bigint", update: false })
  amount: number;

  // TODO: add all the other fields as necessary here

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

  static async create(transactionHash: string, blockchain: Blockchain): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.transactionHash = transactionHash;
    transaction.blockchain = blockchain;

    const insertResult = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Transaction)
      .values(transaction)
      .orIgnore()
      .returning("*")
      .execute();

    if ((insertResult.raw as Array<Transaction>).length == 0) {
      const collidingEntry = await AppDataSource.getRepository(Transaction).findOne({
        where: { transactionHash, blockchain },
      });
      if (collidingEntry?.equal(transactionHash, blockchain)) {
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
