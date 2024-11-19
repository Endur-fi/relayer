// import { Account, RpcProvider } from "https://esm.sh/starknet@6.11.0";
// import { Account, RpcProvider } from "npm:starknet";
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
