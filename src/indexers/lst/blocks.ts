import { hash } from "https://esm.sh/starknet@6.16.0";
import type { Config } from "npm:@apibara/indexer";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_ACCEPTED", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_ACCEPTED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        keys: [hash.getSelectorFromName("TransactionExecuted") as FieldElement],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "blocks",
    noTls: Deno.env.get("IS_TLS"), // true for private urls, false for public urls
  },
};

export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000
  );

  return events
    .map(({ event, transaction }) => {
      if (!event) {
        console.log("event keys and data length", event);
        throw new Error("deposits:Expected event with data");
      }

      const userData = {
        block_number: blockNumber,
        timestamp: timestamp_unix,
      };
      return userData;
    })
    .filter((x) => x != null);
}

// -- This script ensures duplicates are not inserted into the blocks table
// CREATE OR REPLACE FUNCTION soft_blocks_reject_on_conflict()
// RETURNS TRIGGER AS $$
// BEGIN
//     IF EXISTS (SELECT 1 FROM blocks WHERE block_number = NEW.block_number) THEN
//         -- You could raise a NOTICE instead of an error
//         RAISE NOTICE 'blocks Soft reject: ADDR % already exists', NEW.block_number;
//         RETURN NULL; -- Skip the insert
//     ELSE
//         RETURN NEW;
//     END IF;
// END;
// $$ LANGUAGE plpgsql;

// CREATE TRIGGER before_blocks_insert_soft_reject
// BEFORE INSERT ON blocks
// FOR EACH ROW
// EXECUTE FUNCTION soft_blocks_reject_on_conflict();
