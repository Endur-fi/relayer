import { hash, num } from "https://esm.sh/starknet@6.16.0";
import type { Config } from "npm:@apibara/indexer";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";

function standariseAddress(address: string | bigint) {
  let _a = address;
  if (!address) {
    _a = "0";
  }
  const a = num.getHexString(num.getDecimalString(_a.toString()));
  return a;
}

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_ACCEPTED", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_ACCEPTED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress:
          "0x07b696af58c967c1b14c9dde0ace001720635a660a8e90c565ea459345318b30" as FieldElement,
        includeTransaction: false,
        keys: [hash.getSelectorFromName("Transfer") as FieldElement],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "ekubo_nfts",
    noTls: Deno.env.get("IS_TLS") == 'true', // true for private urls, false for public urls
  },
};

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
    new Date(timestamp as string).getTime() / 1000
  );

  return (events || []).map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("tranfers:Expected event with data");
    }

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const from = standariseAddress(event?.data?.[0]);
    const to = standariseAddress(event?.data?.[1]);

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js
    const value = Number(event?.data?.[2]).toString();

    const transactionHash = receipt.transactionHash;
    const transferData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      txHash: transactionHash,
      timestamp: timestamp_unix,
      from_address: from,
      to_address: to,
      nft_id: value,
    };

    console.log("transfer event data", transferData);
    return transferData;
  });
}
