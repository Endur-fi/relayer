import "reflect-metadata"; // Reflect metadata polyfill

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  FindFirstWithdraw_queueResolver,
  FindManyWithdraw_queueResolver,
} from "@generated/type-graphql";
import { PrismaClient } from "@prisma/client";
import { buildSchema } from "type-graphql";

import { UserPointsResolver } from "../resolvers/user-points";

const prisma = new PrismaClient();

async function main() {
  const schema = await buildSchema({
    resolvers: [
      FindManyWithdraw_queueResolver,
      FindFirstWithdraw_queueResolver,
      UserPointsResolver,
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

export { main };
