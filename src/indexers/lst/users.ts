import { hash } from "https://esm.sh/starknet@6.16.0";
import type { Config } from "npm:@apibara/indexer";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";

import { getAddresses } from "../../common/constants.ts";
import {
  getNetwork,
  standariseAddress,
} from "../../common/indexerUtils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_ACCEPTED", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_ACCEPTED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: getAddresses(getNetwork()).LST as FieldElement,
        keys: [hash.getSelectorFromName("Transfer") as FieldElement],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "users",
    noTls: true, // true for private urls, false for public urls
  },
};

// #[derive(Drop, PartialEq, starknet::Event)]
// pub struct Transfer {
//     #[key]
//     pub from: ContractAddress,
//     #[key]
//     pub to: ContractAddress,
//     pub value: u256,
// }

export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000
  );

  return events
    .map(({ event, transaction }) => {
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
      const from = event.keys[1];
      const to = event.keys[2];
      const transactionHash = transaction.meta.hash;
      console.log("transactionHash", transactionHash, from, to);

      const records: any[] = [];
      const userData = {
        block_number: blockNumber,
        tx_index: transaction.meta?.transactionIndex ?? 0,
        event_index: event.index ?? 0,
        timestamp: timestamp_unix,
        tx_hash: transactionHash,
        user_address: "0",
      };

      if (
        from !=
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        const _userData = { ...userData };
        _userData.user_address = standariseAddress(from);
        records.push(_userData);
      }

      if (
        to !=
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        const _userData = { ...userData };
        _userData.user_address = standariseAddress(to);
        records.push(_userData);
      }

      if (records.length == 2) console.log("event data", records);
      return records;
    })
    .flat()
    .filter((x) => x != null);
}

// -- This script ensures duplicates are not inserted into the users table
// CREATE OR REPLACE FUNCTION soft_reject_on_conflict()
// RETURNS TRIGGER AS $$
// BEGIN
//     IF EXISTS (SELECT 1 FROM users WHERE user_address = NEW.user_address) THEN
//         -- You could raise a NOTICE instead of an error
//         RAISE NOTICE 'Users Soft reject: ADDR % already exists', NEW.user_address;
//         RETURN NULL; -- Skip the insert
//     ELSE
//         RETURN NEW;
//     END IF;
// END;
// $$ LANGUAGE plpgsql;

// CREATE TRIGGER before_insert_soft_reject
// BEFORE INSERT ON users
// FOR EACH ROW
// EXECUTE FUNCTION soft_reject_on_conflict();
