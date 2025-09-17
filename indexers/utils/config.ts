import "dotenv/config";

import { eventKey } from "./common_transform";
import { hash } from "starknet";
import { getAddresses} from "../../src/common/constants";
import { getNetwork, standariseAddress } from "../../src/common/utils";
import { Block, Event } from "@apibara/starknet";
import { onEventEkuboLPLst } from "./ekubo_lst_onevent";

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

export type OnEvent = (event: Event, processedRecord: Record<string, any>, allEvents: readonly Event[], block: Block) => Promise<Record<string, any> | null>;

export interface EventConfig {
  tableName: string;
  eventName: string;
  contracts: ContractConfig[];
  keys?: `0x${string}`[][]; // custom key combinations
  defaultKeys?: `0x${string}`[]; // default keys if keys not specified
  keyFields: EventField[];
  dataFields: EventField[];
  additionalFields: AdditionalField[];
  onEvent?: OnEvent;
  includeSiblings?: boolean;
}

export const withdrawKey = eventKey("WithdrawQueue");

// model withdraw_queue {
//   block_number Int
//   tx_index     Int    @default(0)
//   event_index  Int    @default(0)
//   tx_hash      String

export const CONFIG: EventConfig[] = [
  // {
  //   tableName: "users",
  //   eventName: "Transfer",
  //   contracts: [
  //     ...getAddresses(getNetwork()).LSTs.filter(lst => {
  //       return lst.Asset.eqString('0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d');
  //     }).map(lst => ({
  //       address: standariseAddress(lst.LST.address),
  //     }))
  //   ],
  //   keyFields: [],
  //   dataFields: [
  //     // { name: "value", type: "u256", sqlType: "numeric(78,0)" },
  //   ],
  //   additionalFields: [
  //     { name: "user_address", source: "custom", sqlType: "text", customLogic: (event) => {
  //       return event.keys[2]; // to address
  //     } },
  //   ],
  //   defaultKeys: [eventKey("Transfer")],
  //   onEvent: onEventEkuboLPLst
  // },
  {
    tableName: "ekubo_positions_events",
    eventName: "PositionUpdated",
    includeSiblings: true,
    contracts: [
      {
        address: "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b",
      }
    ],
    keyFields: [
    ],
    dataFields: [
      { name: "locker", type: "ContractAddress", sqlType: "text" },
      { name: "token0", type: "ContractAddress", sqlType: "text" },
      { name: "token1", type: "ContractAddress", sqlType: "text" },
      { name: "pool_fee", type: "u128", sqlType: "numeric(78,0)" },
      { name: "pool_tick_spacing", type: "u64", sqlType: "numeric(20,0)" },
      { name: "extension", type: "text", sqlType: "text" },
      { name: "position_id", type: "u128", sqlType: "numeric(78,0)" },
    ],
    additionalFields: [{
      name: "contract_address",
      source: "custom",
      sqlType: "text",
      customLogic: (event) => {
        return event.address;
      },
    }, {
      name: "lower_bound",
      source: "custom",
      sqlType: "numeric(20,0)",
      customLogic: (event) => {
        return Number(BigInt(event.data[7]) * (BigInt(BigInt(event.data[8]) == 0n ? 1 : -1)));
      },
    }, {
      name: "upper_bound",
      source: "custom",
      sqlType: "numeric(20,0)",
      customLogic: (event) => {
        return Number(BigInt(event.data[9]) * (BigInt(BigInt(event.data[10]) == 0n ? 1 : -1)));
      },
    }, {
      name: "liquidity_delta",
      source: "custom",
      sqlType: "numeric(78,0)",
      customLogic: (event) => {
        return (BigInt(event.data[11]) * (BigInt(BigInt(event.data[12]) == 0n ? 1 : -1))).toString();
      },
    }, {
      name: "amount0_delta",
      source: "custom",
      sqlType: "numeric(78,0)",
      customLogic: (event) => {
        return (BigInt(event.data[13]) * (BigInt(BigInt(event.data[14]) == 0n ? 1 : -1))).toString();
      },
    }, {
      name: "amount1_delta",
      source: "custom",
      sqlType: "numeric(78,0)",
      customLogic: (event) => {
        return (BigInt(event.data[15]) * (BigInt(BigInt(event.data[16]) == 0n ? 1 : -1))).toString();
      },
    }],
    defaultKeys: [eventKey("PositionUpdated")],
    onEvent: onEventEkuboLPLst
  }
  // {
  //   tableName: "withdraw_queue_events",
  //   eventName: "WithdrawQueue",
  //   contracts: [
  //     ...getAddresses(getNetwork()).LSTs.map((lst) => ({
  //       address: standariseAddress(lst.WithdrawQueue.address),
  //     })),
  //   ],
  //   defaultKeys: [withdrawKey],
  //   keyFields: [
  //     { name: "receiver", type: "ContractAddress", sqlType: "text" },
  //     { name: "caller", type: "ContractAddress", sqlType: "text" },
  //   ],
  //   dataFields: [
  //     { name: "request_id", type: "u128", sqlType: "numeric(20,0)" },
  //     { name: "amount", type: "u256", sqlType: "numeric(78,0)" },
  //     { name: "amount_lst", type: "u256", sqlType: "numeric(78,0)" },
  //     { name: "is_claimed", type: "bool", sqlType: "boolean" },
  //     { name: "timestamp", type: "u64", sqlType: "numeric(20,0)" },
  //     { name: "claim_time", type: "u64", sqlType: "numeric(20,0)" },
  //     { name: "cumulative_requested_amount_snapshot", type: "u256", sqlType: "numeric(78,0)" },
  //     { name: "timestamp", type: "u64", sqlType: "numeric(20,0)" },
  //   ],
  //   additionalFields: [
  //     {
  //       name: "queue_contract",
  //       source: "custom",
  //       sqlType: "text",
  //       customLogic: (event) => {
  //         return event.address;
  //       },
  //     },
  //   ],
  // },
];