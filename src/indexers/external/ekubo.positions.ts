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
        // Ekubo core
        fromAddress:
          "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b" as FieldElement,
        includeTransaction: false,
        keys: [hash.getSelectorFromName("PositionUpdated") as FieldElement],
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "ekubo_positions", // look for ekubo_positions_view in triggers/migraitons.sql to understand this table
    noTls: Deno.env.get("IS_TLS") == 'true', // true for private urls, false for public urls
  },
};

export default function transform({ header, events }: Block) {
  if (!header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000
  );

  return (events || [])
    .map((res) => {
      const { event, receipt } = res;
      if (!event || !event.data || !event.keys) {
        throw new Error("tranfers:Expected event with data");
      }

      const token0 = standariseAddress(event?.data?.[1]);
      const token1 = standariseAddress(event?.data?.[2]);
      if (
        token0 !=
          "0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a" ||
        token1 !=
          "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
      ) {
        return null;
      }
      const fee = event?.data?.[3];
      const tick_spacing = event?.data?.[4];
      const extension = event?.data?.[5];
      const position_id = Number(event?.data?.[6]);
      const lower_bound =
        Number(event?.data?.[7]) * (Number(event?.data?.[8]) == 0 ? 1 : -1);
      const upper_bound =
        Number(event?.data?.[9]) * (Number(event?.data?.[10]) == 0 ? 1 : -1);
      const liquidity_delta =
        (Number(event?.data?.[12]) == 0 ? "" : "-") +
        num.getDecimalString(event?.data?.[11]);
      const amount0_delta =
        (Number(event?.data?.[14]) == 0 ? "" : "-") +
        num.getDecimalString(event?.data?.[13]);
      const amount1_delta =
        (Number(event?.data?.[16]) == 0 ? "" : "-") +
        num.getDecimalString(event?.data?.[15]);

      const transactionHash = res.receipt.transactionHash;
      const transferData = {
        block_number: blockNumber,
        tx_index: res.receipt.transactionIndex ?? 0,
        event_index: event.index ?? 0,
        txHash: transactionHash,
        timestamp: timestamp_unix,

        pool_fee: fee,
        pool_tick_spacing: tick_spacing,
        extension,
        position_id,
        lower_bound,
        upper_bound,
        liquidity_delta: liquidity_delta.toString(),
        amount0_delta: amount0_delta.toString(),
        amount1_delta: amount1_delta.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("ekubo position event data", transferData);
      return transferData;
    })
    .filter((el) => el !== null);
}
