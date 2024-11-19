# Setup
`pnpm install`

# Prisma
1. Generate through prisma
```
deno run --allow-env --allow-ffi --allow-sys --allow-read --allow-write --allow-run npm:prisma@latest generate
```
or instead just run
```
deno run -A npm:prisma generate
```


# Commands


### Run withdraw queue indexer
`apibara run src/indexers/withdraw_queue/withdrawQueue.ts --allow-env=.env --sink-id 10`
