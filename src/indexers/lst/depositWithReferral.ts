import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";

// import { ABI as LSTAbi } from "../../../abis/LST.ts"
// import { getProvider } from "../../common/utils.ts";
import { hash, num } from "https://esm.sh/starknet@6.16.0";

import { getAddresses } from "../../common/constants.ts";
import { getNetwork, toBigInt } from "../../common/indexerUtils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_PENDING", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [{
      fromAddress: getAddresses(getNetwork()).LST as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("Referral") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "deposits_with_referral",
    noTls: true, // true for private urls, false for public urls
  },
};

// #[derive(Drop, Serde, starknet::Event)]
// struct Referral {
//     #[key]
//     pub referrer: ByteArray,
//     #[key]
//     pub referee: ContractAddress,
//     pub assets: u256,
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
      throw new Error("deposit with referral:Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
      event.keys,
      event.data,
    );

    // let LST = new Contract(LSTAbi, getAddresses().LST, getProvider())
    //   .typedv2(LSTAbi);

    // let parsed = LST.parseEvents(receipt);
    // console.log("parsed" , parsed);

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const referrer = event?.keys?.[2];
    const referee = event?.keys?.[4];

    if (!referrer) {
      throw new Error("Referrer is required");
    }

    const referrerParsed = num.toHexString(referrer).toString()
      .match(/.{1,2}/g)
      ?.reduce((acc, char) => acc + String.fromCharCode(parseInt(char, 16)), "")
      ?.replace(/\x00/g, ""); // Remove null bytes

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js

    const assets = toBigInt(event?.data?.[0]).toString();

    const depositWithReferralData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      timestamp: timestamp_unix,
      referrer: referrerParsed,
      referee,
      assets,
    };

    console.log("event data", depositWithReferralData);
    return depositWithReferralData;
  });
}
