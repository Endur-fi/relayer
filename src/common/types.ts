import { Account, RpcProvider } from "npm:starknet";

export interface NetworkConfig {
  provider: RpcProvider;
  account: Account;
  network: Network;
}

export declare enum Network {
  mainnet = "mainnet",
  sepolia = "sepolia",
  devnet = "devnet",
}
