import { Account, RpcProvider } from "starknet";

export interface NetworkConfig {
  provider: RpcProvider;
  account: Account;
  network: Network;
}

export enum Network {
  mainnet = "mainnet",
  sepolia = "sepolia",
  devnet = "devnet",
}
