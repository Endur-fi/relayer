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

  finality: "DATA_STATUS_ACCEPTED", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [{
      fromAddress: getAddresses().WithdrawQueue as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("WithdrawQueue") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("POSTGRES_CONNECTION_STRING"),
    tableName: "withdraw_queue",
  },
};

// #[derive(Drop, Copy, Serde, starknet::Store, starknet::Event)]
// pub struct WithdrawRequest {
//     pub amountSTRK: u256, // amount of STRK to be withdrawn
//     pub amountkSTRK: u256, // amount of kSTRK burned
//     pub isClaimed: bool,
//     pub timestamp: u64, // time when request was raised
//     pub claimTime: u64, // time when request can be claimed without queue (21 days)
// }

// #[derive(Drop, Copy, starknet::Event, Serde)]
// pub struct WithdrawQueue {
//     receiver: ContractAddress,
//     caller: ContractAddress,
//     request: WithdrawRequest,
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
      throw new Error("withdraw_queue:Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
    );

    const eventData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      receiver: event.data.at(0),
      caller: event.data.at(1),
      amount_strk: toBigInt(event.data.at(2)).toString(),
      amount_kstrk: toBigInt(event.data.at(4)).toString(),
      timestamp: timestamp_unix,
    };

    console.log("event data", eventData);
    return eventData;
  });
}
