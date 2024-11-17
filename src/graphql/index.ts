import "https://esm.sh/reflect-metadata@0.2.2"; // Reflect metadata polyfill
import { ApolloServer } from "https://esm.sh/@apollo/server";
import type { PrismaClient } from "../../prisma/generated/client/index.js";
import { buildSchema, Resolver, Query, Arg } from "https://esm.sh/type-graphql@2.0.0-rc.2";
import { startStandaloneServer } from "https://esm.sh/@apollo/server/standalone";

import { 
    Withdraw_queue,
    FindManyWithdraw_queueResolver
} from "../../prisma/generated/type-graphql/index.ts";

const prisma = new PrismaClient();

async function main() {
  const schema = await buildSchema({
    resolvers: [
        FindManyWithdraw_queueResolver
    ],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => ({ prisma }),
    listen: { port: parseInt(Deno.env.get("PORT") || '') || 4000 },
  });
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

if (require.main === module) {
  main().catch(console.error);
}