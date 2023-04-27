import { ethers } from "ethers";
import { BlockchainReader } from "../blockchain_reader";
import { BLOCK_CONFIRMATIONS } from "../constants/blockchain";
import { Blockchain } from "../constants/data.enums";
import ERC20ABI from "../abi/erc20.json";
import { Transaction } from "../data/transaction";


export class EventListener {
  private blockchainReader: BlockchainReader;
  private latestBlockWithSavedEvents: number;

  constructor(startBlock: number, providerUrl: string) {
    this.blockchainReader = new BlockchainReader(providerUrl);
    this.latestBlockWithSavedEvents = startBlock
  }

  async listenToEvents(): Promise<void> {
    this.blockchainReader.listenToBlockHeaders(async (blockNumber: number) => {
      await this.processEvents(blockNumber)
    });
  }


  async processEvents(latestBlock: number): Promise<void> {
    const fromBlock =
      this.latestBlockWithSavedEvents == 0
        ? Math.max(latestBlock - 500, 1)
        : Math.max(this.latestBlockWithSavedEvents - BLOCK_CONFIRMATIONS[Blockchain.ETHEREUM], 1);

    const eventTopic = ethers.keccak256(ethers.toUtf8Bytes("Transfer(address,address,unit256)"));
    const stargateEncodedAddress = ethers.AbiCoder.defaultAbiCoder().encode(["address"], ["0xdf0770df86a8034b3efef0a1bb3c889b8332ff56"]);
    const topics = [eventTopic, stargateEncodedAddress];
    const logs = await this.blockchainReader.getEvents(fromBlock, latestBlock, topics)

    const abi = new ethers.Interface(ERC20ABI.abi)

    const promises = logs.map(async (log) => {
      const event = abi.parseLog({ topics: log.topics as string[], data: log.data })
      if (!event) {
        return
      }

      const { from, to, amount } = event.args;

      const transactionReceipt = await this.blockchainReader.getTransactionReceipt(log.transactionHash)
      const block = await this.blockchainReader.getBlock(log.transactionHash)

      if (!block || !transactionReceipt) {
        return
      }

      const createdAt = new Date(block!.timestamp);

      await Transaction.create(
        from,
        to,
        amount,
        log.transactionHash,
        Number(transactionReceipt.gasUsed),
        Number(transactionReceipt?.gasPrice),
        createdAt
      )
    })

    await Promise.all(promises)
    this.latestBlockWithSavedEvents = Math.max(this.latestBlockWithSavedEvents, latestBlock)
  }
}
