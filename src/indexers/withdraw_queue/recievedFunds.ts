import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import { hash } from "npm:starknet";

import { ADDRESSES as contracts } from "../../constants.js";
import { toBigInt } from "../../utils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_ACCEPTED", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [{
      fromAddress: contracts.lst as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("ReceivedFunds") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("POSTGRES_CONNECTION_STRING"),
    tableName: "received_funds",
  },
};

// #[derive(Drop, Copy, Serde, starknet::Event)]
// pub struct ReceivedFunds {
//     amount: u256,
//     sender: ContractAddress,
//     unprocessed: u256,
//     intransit: u256,
//     timestamp: u64
// }
export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000,
  );

  return events.map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("ReceivedFunds: Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
    );

    const amount = toBigInt(event.data.at(0)).toString();
    const sender = event.data.at(2);
    const unprocessed = event.data.at(3);
    const intransit = event.data.at(5);

    if (timestamp_unix.toString() == event.data.at(6)) {
      throw Error("ReceivedFunds: Timestamp incorrect");
    }

    const depositData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      amount,
      sender,
      unprocessed,
      intransit,
      timestamp: timestamp_unix,
    };

    console.log("event data", depositData);
    return depositData;
  });
}
