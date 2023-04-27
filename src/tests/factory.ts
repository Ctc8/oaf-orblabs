import { Blockchain } from "../constants/data.enums";
import { Transaction } from "../data/transaction";
import { AppDataSource } from "../data_source";
import { uuid } from "../utils/uuid";

export class OAFFactory {
  static async createTransactionMock(overwrites: Partial<Transaction>, insertToDB = false): Promise<Transaction> {
    const defaultValue = new Transaction();
    defaultValue.generateUuid();
    defaultValue.blockchain = Blockchain.ETHEREUM;
    defaultValue.from = uuid()
    defaultValue.to = uuid()
    defaultValue.amount = Math.floor(Math.random() * 10_000_000);
    defaultValue.transactionHash = uuid();
    defaultValue.gas = Math.floor(Math.random() * 10_000_000);
    defaultValue.gasPrice = Math.floor(Math.random() * 10_000_000);
    defaultValue.createdAt = new Date();

    Object.assign(defaultValue, overwrites);

    if (insertToDB) {
      return await AppDataSource.getRepository(Transaction).save(defaultValue);
    }

    return defaultValue;
  }
}
