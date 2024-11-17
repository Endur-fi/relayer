# Setup
`pnpm install`

# Prisma
1. Generate through prisma  
```deno run --allow-env=.env  --allow-read --allow-write --allow-run npm:prisma@latest generate`

# Commands


### Run withdraw queue indexer
`apibara run src/indexers/withdraw_queue/withdrawQueue.ts --allow-env=.env --sink-id 10`