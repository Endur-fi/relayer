// cannot do bcz this needs generated graphpl typings
// and they use relative paths which fails Deno

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import "reflect-metadata"; // Reflect metadata polyfill
import { Arg, buildSchema, Query, Resolver } from "type-graphql";

import {
  FindFirstWithdraw_queueResolver,
  FindManyWithdraw_queueResolver,
} from "@generated/type-graphql";

import WithdrawQueueStatsResolver from "../resolvers/global";

const prisma = new PrismaClient();

async function main() {
  const schema = await buildSchema({
    resolvers: [
      FindManyWithdraw_queueResolver,
      FindFirstWithdraw_queueResolver,
      WithdrawQueueStatsResolver,
    ],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => ({ prisma }),
    listen: { port: parseInt(process.env.PORT || "4000") },
  });
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

if (require.main === module) {
  main().catch(console.error);
}
