import { Account, num, RpcProvider } from "https://esm.sh/starknet@6.16.0";
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
// import { Network } from "./constants.ts";

export function getProvider(): RpcProvider {
  assert(Deno.env.has("RPC_URL"), "RPC URL not set in .env");
  // use this to explicitly read from .env of this project 
  // (VT: I have some global env variables set as well)
  const env = config();
  return new RpcProvider({ nodeUrl: env.RPC_URL });
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


export function toBigInt(value: string | undefined) {
  if (!value) return BigInt(0);

  return BigInt(value.toString());
}

export function toBoolean(value: string) {
  const numValue = Number(BigInt(value));
  if (numValue == 0) return false;
  if (numValue == 1) return true;
  throw new Error("Invalid boolean value");
}

export function toNumber(el: string) {
  if (!el) return 0;
  return Number(el.toString());
}

export function standariseAddress(address: string | bigint) {
  let _a = address;
  if (!address) {
    _a = "0";
  }
  const a = num.getHexString(num.getDecimalString(_a.toString()));
  return a;
}

// export function getNetwork(): 'mainnet' | 'sepolia' {
//   assert(Deno.env.has("NETWORK"), "Network not configured in .env");

//   const network = Deno.env.get("NETWORK") as string;
//   if (network == Network.sepolia) {
//     return 'sepolia';
//   } else if (network == Network.mainnet) {
//     return 'mainnet';
//   } else {
//     throw new Error("Incorrect network configured, check .env file");
//   }
// }