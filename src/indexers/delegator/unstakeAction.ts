import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import { hash } from "https://esm.sh/starknet@6.11.0";

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
      keys: [hash.getSelectorFromName("DelegatorUpdate") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("POSTGRES_CONNECTION_STRING"),
    tableName: "unstake_action",
  },
};

// #[derive(Drop, Copy, Serde, starknet::Store, starknet::Event)]
// pub struct DelegatorInfo {
//     pub is_active: bool,
//     pub delegator_index: u32
// }

// #[derive(Drop, Copy, Serde, starknet::Event)]
// struct DelegatorUpdate {
//     pub delegator: ContractAddress,
//     pub info: DelegatorInfo,
// }
export function factory({ header, events }: Block) {
  if (!events || !header) return [];

  const filters = events.filter(({ event }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("ReceivedFunds: Expected event with data");
    }

    const is_active = Boolean(event.data[1]);
    return is_active == true;
  }).flatMap(({ event }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("ReceivedFunds: Expected event with data");
    }

    const delegatorAddress = event.data[0];
    return [
      {
        fromAddress: delegatorAddress,
        keys: [
          hash.getSelectorFromName(
            "UnstakeIntentStarted",
          ) as FieldElement,
        ],
      },
    ];
  });

  if (filters.length == 0) {
    return {};
  }

  return {
    filter: {
      header: { weak: true },
      events: filters,
    },
  };
}

// #[derive(Drop, starknet::Event)]
// pub struct UnstakeAction {
//     amount: u128,
// }
export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber } = header;

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

    const eventData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      amount,
    };

    console.log("event data", eventData);
    return eventData;
  });
}
