import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer/sink/postgres";
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
      fromAddress: getAddresses().LST as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("DispatchToStake") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("POSTGRES_CONNECTION_STRING"),
    tableName: "dispatch_to_stake",
  },
};

// #[derive(Drop, Copy, starknet::Event)]
// pub struct DispatchToStake {
//     pub delegator: ContractAddress,
//     pub amount: u256,
// }
export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber } = header;

  return events.map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("dispatch_to_stake:Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
    );

    const delegator = event?.data?.at(0);
    const amount = toBigInt(event.data?.at(1)).toString();

    const eventData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      delegator,
      amount,
    };

    console.log("event data", eventData);
    return eventData;
  });
}
