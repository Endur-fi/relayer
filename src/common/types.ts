import { Account, RpcProvider } from "starknet";
import { Network } from "./constants";
// import { Account, RpcProvider } from "https://esm.sh/starknet@6.11.0";

export interface NetworkConfig {
  provider: RpcProvider;
  account: Account;
  network: Network;
  tgToken?: string;
}