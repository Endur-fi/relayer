import type { Config } from 'npm:@apibara/indexer';
import type { Block, FieldElement, Starknet } from 'npm:@apibara/indexer@0.4.1/starknet';
import type { Postgres } from 'npm:@apibara/indexer@0.4.1/sink/postgres';
import { hash } from 'https://esm.sh/starknet@6.16.0';

import { getAddresses } from '../../common/constants.ts';
import { getNetwork, toBigInt } from '../../common/indexerUtils.ts';

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get('STREAM_URL'),
  startingBlock: Number(Deno.env.get('STARTING_BLOCK')),

  finality: 'DATA_STATUS_ACCEPTED', // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_ACCEPTED"?
  network: 'starknet',
  filter: {
    header: { weak: true },
    events: [
      {
        fromAddress: getAddresses(getNetwork()).LST as FieldElement,
        includeTransaction: true,
        keys: [hash.getSelectorFromName('Transfer') as FieldElement],
      },
    ],
  },
  sinkType: 'postgres',
  sinkOptions: {
    connectionString: Deno.env.get('DATABASE_URL'),
    tableName: 'transfer',
    noTls: true, // true for private urls, false for public urls
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
    new Date(timestamp as string).getTime() / 1000,
  );

  return (events || []).map(({ event, transaction }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("tranfers:Expected event with data");
    }

    if (!transaction || !transaction.meta) return null;

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
    );

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const from = event?.keys?.[1];
    const to = event?.keys?.[2];

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js
    const value = toBigInt(event?.data?.[0]).toString();

    const transactionHash = transaction.meta.hash;
    const transferData = {
      block_number: blockNumber,
      tx_index: transaction.meta?.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      txHash: transactionHash,
      timestamp: timestamp_unix,
      from,
      to,
      value,
    };

    console.log("transfer event data", transferData);
    return transferData;
  });
}