import { hash } from "https://esm.sh/starknet@6.16.0";
import type { Config } from "npm:@apibara/indexer";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";

import { getAddresses } from "../../common/constants.ts";
import { getNetwork, toBigInt } from "../../common/indexerUtils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_PENDING", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: getAddresses(getNetwork()).LST as FieldElement,
        includeTransaction: true,
        keys: [hash.getSelectorFromName("Deposit") as FieldElement],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "deposits",
    noTls: Deno.env.get("IS_TLS"), // true for private urls, false for public urls
  },
};

// #[derive(Drop, PartialEq, starknet::Event)]
// pub struct Deposit {
//     #[key]
//     pub sender: ContractAddress,
//     #[key]
//     pub owner: ContractAddress,
//     pub assets: u256,
//     pub shares: u256
// }

export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000
  );

  return events.map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("deposits:Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length
    );

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const sender = event?.keys?.[1];
    const owner = event?.keys?.[2];

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js
    const assets = toBigInt(event?.data?.[0]).toString();
    const shares = toBigInt(event?.data?.[2]).toString();

    const depositData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      timestamp: timestamp_unix,
      sender,
      owner,
      assets,
      shares,
    };

    console.log("event data", depositData);
    return depositData;
  });
}
