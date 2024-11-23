import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import { hash } from "https://esm.sh/starknet@6.11.0";

import { standariseAddress, toBigInt, toBoolean, toNumber } from "../../common/utils.ts";
import { getAddresses } from "../../common/constants.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_ACCEPTED", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: false },
    events: [{
      fromAddress: getAddresses().WithdrawQueue as FieldElement,
      keys: [hash.getSelectorFromName("WithdrawQueue") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "withdraw_queue",
    noTls: false // true for private urls, false for public urls
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

  return events.map(({ event, transaction }) => {
    try {
    if (!event || !event.data || !event.keys || !transaction.meta) {
      console.error("withdraw_queue:Expected event with data");
      return null;
    }
    const transactionHash = transaction.meta.hash;

    let eventData: any = null;
    if (event.data.length == 10) {
      // pre-audit version where request id is u256 and no request id in event
      eventData = {
        block_number: blockNumber,
        tx_index: transaction.meta?.transactionIndex ?? 0,
        event_index: event.index ?? 0,
        tx_hash: transactionHash,
        receiver: standariseAddress(event.data.at(0)),
        caller: standariseAddress(event.data.at(1)),
        request_id: '0',
        amount_strk: toBigInt(event.data.at(2)).toString(),
        amount_kstrk: toBigInt(event.data.at(4)).toString(),
        is_claimed: toBoolean(event.data.at(6)),
        claim_time: toNumber(event.data.at(8)),
        cumulative_requested_amount_snapshot: '0',
        is_rejected: false,
        timestamp: timestamp_unix,
      };
    } else if (event.data.length == 9) {
      // post-audit version where request id is u128 and request id is in event
      // also event is indexed
      eventData = {
        block_number: blockNumber,
        tx_index: transaction.meta?.transactionIndex ?? 0,
        event_index: event.index ?? 0,
        tx_hash: transactionHash,

        receiver: standariseAddress(event.keys.at(1)),
        caller: standariseAddress(event.keys.at(2)),
        request_id: toNumber(event.data.at(0)).toString(),
        amount_strk: toBigInt(event.data.at(1)).toString(),
        amount_kstrk: toBigInt(event.data.at(3)).toString(),
        is_claimed: toBoolean(event.data.at(5)),
        claim_time: toNumber(event.data.at(7)),
        cumulative_requested_amount_snapshot: '0',
        is_rejected: false,
        timestamp: timestamp_unix,
      };
    } else if (event.data.length == 11) {
      // post-audit version where cummulative sum is added and keys are indexed
      // also event is indexed
      eventData = {
        block_number: blockNumber,
        tx_index: transaction.meta?.transactionIndex ?? 0,
        event_index: event.index ?? 0,
        tx_hash: transactionHash,

        receiver: standariseAddress(event.keys.at(1)),
        caller: standariseAddress(event.keys.at(2)),
        request_id: toNumber(event.data.at(0)).toString(),
        amount_strk: toBigInt(event.data.at(1)).toString(),
        amount_kstrk: toBigInt(event.data.at(3)).toString(),
        is_claimed: toBoolean(event.data.at(5)),
        claim_time: toNumber(event.data.at(7)),
        cumulative_requested_amount_snapshot: toBigInt(event.data.at(8)).toString(),
        is_rejected: false,
        timestamp: timestamp_unix
      };
    } else {
      console.error("unexpected event data length", event.data.length);
      return null;
    }

    console.log("event data", eventData);
    return eventData;
    } catch(e) {
      console.error("Error in withdraw_queue transform", e);
      return null
    }
  }).filter((x) => x !== null);
}
