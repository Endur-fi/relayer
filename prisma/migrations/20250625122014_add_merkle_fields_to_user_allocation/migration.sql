-- CreateEnum
CREATE TYPE "UserPointsType" AS ENUM ('Early', 'Priority', 'Bonus', 'Referrer');

-- CreateTable
CREATE TABLE "deposits" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "shares" TEXT NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "deposits_with_referral" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "referrer" TEXT NOT NULL,
    "referee" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "transfer" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" DECIMAL(30,0) NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "withdraw_queue" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT NOT NULL,
    "caller" TEXT NOT NULL,
    "amount_strk" TEXT NOT NULL,
    "amount_kstrk" TEXT NOT NULL,
    "request_id" BIGINT NOT NULL,
    "is_claimed" BOOLEAN NOT NULL,
    "claim_time" INTEGER NOT NULL,
    "receiver" TEXT NOT NULL,
    "cumulative_requested_amount_snapshot" TEXT NOT NULL,
    "is_rejected" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "received_funds" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "amount" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "unprocessed" TEXT NOT NULL,
    "intransit" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "dispatch_to_stake" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "delegator" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "_cursor" BIGINT,
    "timestamp" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "dispatch_to_withdraw_queue" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "amount" TEXT NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "unstake_action" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "amount" TEXT NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "unstake_intent_started" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "amount" TEXT NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "users" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "user_balances" (
    "block_number" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "vesuAmount" TEXT NOT NULL,
    "ekuboAmount" TEXT NOT NULL,
    "nostraLendingAmount" TEXT NOT NULL,
    "nostraDexAmount" TEXT NOT NULL,
    "walletAmount" TEXT NOT NULL,
    "strkfarmAmount" TEXT NOT NULL,
    "opusAmount" TEXT NOT NULL DEFAULT '0',
    "total_amount" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "user_points" (
    "block_number" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "points" DECIMAL(65,30) NOT NULL,
    "type" "UserPointsType" NOT NULL,
    "remarks" TEXT
);

-- CreateTable
CREATE TABLE "points_aggregated" (
    "user_address" TEXT NOT NULL,
    "total_points" BIGINT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "user_allocation" (
    "user_address" TEXT NOT NULL,
    "allocation" TEXT NOT NULL,
    "proof" TEXT,
    "merkle_root" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "blocks" (
    "block_number" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "price_info" (
    "block_number" INTEGER NOT NULL,
    "dex_price" DECIMAL(30,18) NOT NULL,
    "true_price" DECIMAL(30,18) NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "dex_positions" (
    "pool_key" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "strk_amount" TEXT NOT NULL,
    "score" DECIMAL(65,30) NOT NULL,
    "is_points_settled" BOOLEAN NOT NULL DEFAULT false,
    "additional_info" TEXT NOT NULL DEFAULT '{}',
    "block_number" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "deposits__cursor_idx" ON "deposits"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_block_number_tx_index_event_index_key" ON "deposits"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "deposits_with_referral__cursor_idx" ON "deposits_with_referral"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_with_referral_block_number_tx_index_event_index_key" ON "deposits_with_referral"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "transfer__cursor_idx" ON "transfer"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_block_number_tx_index_event_index_key" ON "transfer"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "withdraw_queue__cursor_idx" ON "withdraw_queue"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "withdraw_queue_block_number_tx_index_event_index_key" ON "withdraw_queue"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "received_funds__cursor_idx" ON "received_funds"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "received_funds_block_number_tx_index_event_index_key" ON "received_funds"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "dispatch_to_stake__cursor_idx" ON "dispatch_to_stake"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "dispatch_to_stake_block_number_tx_index_event_index_key" ON "dispatch_to_stake"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "dispatch_to_withdraw_queue__cursor_idx" ON "dispatch_to_withdraw_queue"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "dispatch_to_withdraw_queue_block_number_tx_index_event_inde_key" ON "dispatch_to_withdraw_queue"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "unstake_action__cursor_idx" ON "unstake_action"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "unstake_action_block_number_tx_index_event_index_key" ON "unstake_action"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "unstake_intent_started__cursor_idx" ON "unstake_intent_started"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "unstake_intent_started_block_number_tx_index_event_index_key" ON "unstake_intent_started"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_address_key" ON "users"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_balances_block_number_user_address_key" ON "user_balances"("block_number", "user_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_points_block_number_user_address_type_key" ON "user_points"("block_number", "user_address", "type");

-- CreateIndex
CREATE UNIQUE INDEX "points_aggregated_user_address_key" ON "points_aggregated"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_allocation_user_address_key" ON "user_allocation"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_block_number_key" ON "blocks"("block_number");

-- CreateIndex
CREATE UNIQUE INDEX "price_info_block_number_key" ON "price_info"("block_number");

-- CreateIndex
CREATE INDEX "price_info_block_number_idx" ON "price_info"("block_number");

-- CreateIndex
CREATE UNIQUE INDEX "dex_positions_user_address_pool_key_timestamp_key" ON "dex_positions"("user_address", "pool_key", "timestamp");

-- AddForeignKey
ALTER TABLE "points_aggregated" ADD CONSTRAINT "points_aggregated_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "user_allocation"("user_address") ON DELETE RESTRICT ON UPDATE CASCADE;
