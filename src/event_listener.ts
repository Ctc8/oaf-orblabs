import { BlockchainReader } from "./blockchain_reader";


export class EventListener {
  private blockchainReader: BlockchainReader;

  constructor() {
    const { PROVIDER_URL } = process.env;
    this.blockchainReader = new BlockchainReader(PROVIDER_URL);
  }

  /**
   * @description Starts listening to finalized blocks over a websocket connection and kicks off
   * event indexing process per block
   */
  async listenToEvents(): Promise<void> {
    // Listen to the block header when the header is received,
    // kick off the message indexing process via fetchEvents
    this.blockchainReader.listenToBlockHeaders(async (blockNumber: number) => {
      // TODO: print logs here or 
      console.log(blockNumber)

    });
  }
}
