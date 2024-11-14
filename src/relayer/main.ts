import { Contract, num } from "npm:starknet";
import { ABI as LSTAbi } from "../../abis/LST.ts";
import { assertEquals } from "jsr:@std/assert";
import { getAddresses } from "../common/constants.ts";
import { getProvider } from "../common/utils.ts";

// export function query(
//   contract_name: keyof typeof ADDRESSES,
//   contract_address: string,
//   package_name: string = "lst",
// ) {
//   const compiledSierra = json.parse(
//     Deno.readTextFileSync(
//       `./abis/${package_name}_${contract_name}.contract_class.json`,
//     ),
//   );
//
//   const contract = new Contract(
//     compiledSierra.abi,
//     contract_address,
//     getProvider(),
//   );
//
//   console.log(contract);
//}

// TODO: Change the type of the amount below

async function main() {
  const address = getAddresses().LST;
  const provider = getProvider();
  const contract = new Contract(LSTAbi, address, provider).typedv2(LSTAbi);

  const version = await contract.getVersion();
  console.log("version", version);

  const owner = await contract.owner();
  console.log("Owner", num.toHex(owner));
  assertEquals(
    num.toHex(owner),
    num.toHex(num.getDecimalString(getAddresses().Admin)).toLowerCase(),
  );
}

main().catch(console.error);
