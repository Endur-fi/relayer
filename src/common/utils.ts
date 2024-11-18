import { Account, RpcProvider } from "https://esm.sh/starknet@6.11.0";
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Network } from "./types.ts";

export function getProvider(): RpcProvider {
  assert(Deno.env.has("RPC_URL"), "RPC URL not set in .env");
  return new RpcProvider({ nodeUrl: Deno.env.get("RPC_URL") });
}

export function getAccount(): Account {
  assert(Deno.env.has("PRIVATE_KEY"), "PRIVATE KEY not set in .env");
  assert(Deno.env.has("ACCOUNT_ADDRESS"), "PRIVATE KEY not set in .env");

  // initialize provider
  const provider = getProvider();
  const privateKey = Deno.env.get("PRIVATE_KEY") as string;
  const accountAddress = Deno.env.get("ACCOUNT_ADDRESS") as string;

  return new Account(provider, accountAddress, privateKey);
}

export function getNetwork(): Network {
  assert(Deno.env.has("NETWORK"), "Network not configured in .env");

  const network = Deno.env.get("NETWORK") as string;
  if (network == Network.sepolia) {
    return Network.sepolia;
  } else if (network == Network.mainnet) {
    return Network.mainnet;
  } else {
    throw new Error("Incorrect network configured, check .env file");
  }
}

export function toBigInt(value: string | undefined) {
  if (!value) return BigInt(0);

  return BigInt(value.toString());
}
