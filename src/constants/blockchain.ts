import { Blockchain } from "./data.enums";

export const BLOCK_CONFIRMATIONS: { [s: string]: number } = {
  [Blockchain.ETHEREUM]: 12,
  [Blockchain.POLYGON]: 60,
  [Blockchain.BINANCE]: 12,
  [Blockchain.ARBITRUM_ONE]: 60,
  [Blockchain.ARBITRUM_NOVA]: 60,
  [Blockchain.OPTIMISM]: 60,
  [Blockchain.EVMOS]: 12,
  [Blockchain.MOONBEAM]: 12,

  // testnets
  [Blockchain.ETHEREUM_GOERLI]: 12,
  [Blockchain.ARBITRUM_NITRO_GOERLI]: 60,
  [Blockchain.OPTIMISM_GOERLI]: 60,
  [Blockchain.POLYGON_MUMBAI]: 60,

  // local testing
  [Blockchain.HARDHAT]: 6,
};
