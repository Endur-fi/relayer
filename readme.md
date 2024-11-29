# Setup
`pnpm install`

# Prisma
1. Generate through prisma
```
deno run --allow-env --allow-ffi --allow-sys --allow-read --allow-write --allow-run npm:prisma@latest generate
```
or instead just run
```
npm install -g typegraphql-prisma
```
```
deno run -A --unstable npm:prisma generate --no-engine
```
Reference: https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy

# Commands


### Run withdraw queue indexer
`apibara run src/indexers/withdraw_queue/withdrawQueue.ts --allow-env=.env --sink-id 10`
