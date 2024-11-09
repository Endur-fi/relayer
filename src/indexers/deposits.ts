// export const config = {
//   sinkType: "postgres",
//   sinkOptions: {
//     tableName: "transfers",
//     invalidate: [{ column: "token_symbol", value: "ETH" }],
//   },
// }

import { Config } from "https://esm.run/@apibara/indexer";

export const config = {
  streamUrl: "https://sepolia.starknet.a5a.ch",
  startingBlock: 10_000,
  network: "starknet",
  finality: "DATA_STATUS_ACCEPTED",
  filter: {
    header: {},
  },
  sinkType: "console",
  sinkOptions: {},
};

// This transform does nothing.
export default function transform(block) {
  return block;
}