import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import { hash } from "https://esm.sh/starknet@6.11.0";

import { toBigInt } from "../../common/utils.ts";
import { getAddresses } from "../../common/constants.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_PENDING", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [{
      fromAddress: getAddresses().LST as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("Transfer") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "transfer",
  },
};

// /// Emitted when tokens are moved from address `from` to address `to`.
// #[derive(Drop, PartialEq, starknet::Event)]
// pub struct Transfer {
//     #[key]
//     pub from: ContractAddress,
//     #[key]
//     pub to: ContractAddress,
//     pub value: u256
// }
export default function transform({ header, events }: Block) {
  if (!header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000,
  );

  return (events || []).filter(({ event }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("tranfers:Expected event with data");
    }

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const from = event?.keys?.[1];

    // Allowing to be zero address
    // since we want to track the burn events
    // and the zero address is used to burn tokens
    return BigInt(from) != BigInt(0);
  }).map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("tranfers:Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
    );

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const from = event?.keys?.[1];
    const to = event?.keys?.[2];

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js
    const value = toBigInt(event?.data?.[0]).toString();

    const transferData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      timestamp: timestamp_unix,
      from,
      to,
      value,
    };

    console.log("event data", transferData);
    return transferData;
  });
}
