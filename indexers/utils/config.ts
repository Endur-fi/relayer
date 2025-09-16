import "dotenv/config";

import { eventKey } from "./common_transform";
import { hash } from "starknet";
import { getAddresses} from "../../src/common/constants";
import { getNetwork, standariseAddress } from "../../src/common/utils";

export interface EventField {
  name: string;
  type: string;
  sqlType: string;
}

export interface AdditionalField {
  name: string;
  source: "transaction" | "block" | "event" | "custom";
  path?: string;
  sqlType: string;
  customLogic?: (
    event: any,
    transaction: any,
    header: any,
    contractInfo?: any
  ) => any;
}

export interface ContractConfig {
  address: string;
}

export interface EventConfig {
  tableName: string;
  eventName: string;
  contracts: ContractConfig[];
  keys?: `0x${string}`[][]; // custom key combinations
  defaultKeys?: `0x${string}`[]; // default keys if keys not specified
  keyFields: EventField[];
  dataFields: EventField[];
  additionalFields: AdditionalField[];
}

export const withdrawKey = eventKey("WithdrawQueue");

// model withdraw_queue {
//   block_number Int
//   tx_index     Int    @default(0)
//   event_index  Int    @default(0)
//   tx_hash      String

export const CONFIG: EventConfig[] = [
  {
    tableName: "withdraw_queue_events",
    eventName: "WithdrawQueue",
    contracts: [
      ...getAddresses(getNetwork()).LSTs.map((lst) => ({
        address: standariseAddress(lst.WithdrawQueue.address),
      })),
    ],
    defaultKeys: [withdrawKey],
    keyFields: [
      { name: "receiver", type: "ContractAddress", sqlType: "text" },
      { name: "caller", type: "ContractAddress", sqlType: "text" },
    ],
    dataFields: [
      { name: "request_id", type: "u128", sqlType: "numeric(20,0)" },
      { name: "amount", type: "u256", sqlType: "numeric(78,0)" },
      { name: "amount_lst", type: "u256", sqlType: "numeric(78,0)" },
      { name: "is_claimed", type: "bool", sqlType: "boolean" },
      { name: "timestamp", type: "u64", sqlType: "numeric(20,0)" },
      { name: "claim_time", type: "u64", sqlType: "numeric(20,0)" },
      { name: "cumulative_requested_amount_snapshot", type: "u256", sqlType: "numeric(78,0)" },
      { name: "timestamp", type: "u64", sqlType: "numeric(20,0)" },
    ],
    additionalFields: [
      {
        name: "queue_contract",
        source: "custom",
        sqlType: "text",
        customLogic: (event) => {
          return event.address;
        },
      },
    ],
  },
];