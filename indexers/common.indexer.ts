import "dotenv/config";

import { defineIndexer } from "@apibara/indexer";
import type {
  ExtractTablesWithRelations,
  TablesRelationalConfig,
} from "drizzle-orm";
import { StarknetStream } from "@apibara/starknet";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { useLogger } from "@apibara/indexer/plugins";

import { getDB } from "./utils";
import { commonTransform, eventKey } from "./utils/common_transform";
import { CONFIG } from "./utils/config";

export default function (runtimeConfig: ApibaraRuntimeConfig) {
  return createIndexer({
    database: getDB(process.env.DATABASE_URL!),
    config: runtimeConfig,
  });
}

export function createIndexer<
  TQueryResult extends PgQueryResultHKT,
  TFullSchema extends Record<string, unknown> = Record<string, never>,
  TSchema extends
    TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>,
>({
  database,
  config,
}: {
  database: PgDatabase<TQueryResult, TFullSchema, TSchema>;
  config: ApibaraRuntimeConfig;
}) {
  const events: any = [];
  
  for (const configKey of Object.keys(CONFIG)) {
    const eventConfig = CONFIG[configKey];
    
    for (const contract of eventConfig.contracts) {
      if (eventConfig.keys) {
        for (const keySet of eventConfig.keys) {
          events.push({
            address: contract.address as `0x${string}`,
            keys: keySet,
            includeSiblings: eventConfig.includeSiblings,
          });
        }
      } else {
        const defaultKeys = eventConfig.defaultKeys || [
          eventKey("Deposit"),
          eventKey("Withdraw"),
        ];
        
        for (const key of defaultKeys) {
          events.push({
            address: contract.address as `0x${string}`,
            keys: [key],
            includeSiblings: eventConfig.includeSiblings,
          });
        }
      }
    }
  }

  return defineIndexer(StarknetStream)({
    streamUrl: process.env.STREAM_URL!,
    startingBlock: BigInt(process.env.STARTING_BLOCK!),
    plugins: [
      // @ts-ignore
      drizzleStorage({
        db: database,
        idColumn: "id",
        persistState: true,
        indexerName: "endur_relayer",
      }),
    ],
    finality: "pending",
    filter: {
      header: "on_data_or_on_new_block",
      events,
    },
    // @ts-ignore
    async transform({ block, finality, endCursor, context }) {
      const logger = useLogger();
      const { db } = useDrizzleStorage();
      // console.log("block", block);
      await commonTransform(
        block,
        finality,
        db,
        logger,
        endCursor,
        context
      );
    },
  });
}