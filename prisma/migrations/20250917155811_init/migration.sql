-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "airfoil";

-- CreateEnum
CREATE TYPE "public"."UserPointsType" AS ENUM ('Early', 'Priority', 'Bonus', 'Referrer');

-- CreateTable
CREATE TABLE "public"."deposits_with_referral_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "referrer" TEXT NOT NULL,
    "referee" TEXT NOT NULL,
    "assets" TEXT NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "deposits_with_referral_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transfer_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" DECIMAL(30,0) NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "transfer_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."withdraw_queue_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT NOT NULL,
    "queue_contract" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "amount_lst" TEXT NOT NULL,
    "request_id" BIGINT NOT NULL,
    "is_claimed" BOOLEAN NOT NULL,
    "claim_time" INTEGER NOT NULL,
    "receiver" TEXT NOT NULL,
    "caller" TEXT NOT NULL,
    "cumulative_requested_amount_snapshot" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "withdraw_queue_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."withdraw_queue" (
    "tx_hash" TEXT NOT NULL,
    "queue_contract" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "amount_lst" TEXT NOT NULL,
    "request_id" BIGINT NOT NULL,
    "is_claimed" BOOLEAN NOT NULL,
    "claim_time" INTEGER NOT NULL,
    "receiver" TEXT NOT NULL,
    "caller" TEXT NOT NULL,
    "cumulative_requested_amount_snapshot" TEXT NOT NULL,
    "is_rejected" BOOLEAN NOT NULL DEFAULT false,
    "is_notified" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "email" TEXT,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_balances" (
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
CREATE TABLE "public"."user_points" (
    "block_number" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "points" DECIMAL(65,30) NOT NULL,
    "type" "public"."UserPointsType" NOT NULL,
    "remarks" TEXT
);

-- CreateTable
CREATE TABLE "public"."points_aggregated" (
    "user_address" TEXT NOT NULL,
    "total_points" BIGINT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."user_allocation" (
    "user_address" TEXT NOT NULL,
    "allocation" TEXT NOT NULL,
    "proof" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."blocks" (
    "block_number" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "public"."price_info" (
    "block_number" INTEGER NOT NULL,
    "dex_price" DECIMAL(30,18) NOT NULL,
    "true_price" DECIMAL(30,18) NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."dex_positions" (
    "pool_key" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "strk_amount" TEXT NOT NULL,
    "score" DECIMAL(65,30) NOT NULL,
    "is_points_settled" BOOLEAN NOT NULL DEFAULT false,
    "additional_info" TEXT NOT NULL DEFAULT '{}',
    "block_number" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."ekubo_positions" (
    "pool_fee" TEXT NOT NULL,
    "pool_tick_spacing" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "lower_bound" INTEGER NOT NULL,
    "upper_bound" INTEGER NOT NULL,
    "liquidity_delta" TEXT NOT NULL,
    "amount0_delta" TEXT NOT NULL,
    "amount1_delta" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "public"."ekubo_nfts" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "from_address" TEXT NOT NULL,
    "to_address" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "public"."ekubo_position_timeseries" (
    "id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "pool_fee" TEXT,
    "pool_tick_spacing" TEXT,
    "extension" TEXT,
    "lower_bound" INTEGER,
    "upper_bound" INTEGER,
    "liquidity" TEXT,
    "amount0" TEXT,
    "amount1" TEXT,
    "owner_address" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "record_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ekubo_position_timeseries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "deposits_with_referral_events__cursor_idx" ON "public"."deposits_with_referral_events"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_with_referral_events_block_number_tx_index_event_i_key" ON "public"."deposits_with_referral_events"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "transfer_events__cursor_idx" ON "public"."transfer_events"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_events_block_number_tx_index_event_index_key" ON "public"."transfer_events"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "withdraw_queue_events__cursor_idx" ON "public"."withdraw_queue_events"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "withdraw_queue_events_block_number_tx_index_event_index_key" ON "public"."withdraw_queue_events"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE UNIQUE INDEX "withdraw_queue_receiver_queue_contract_request_id_key" ON "public"."withdraw_queue"("receiver", "queue_contract", "request_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_address_key" ON "public"."users"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_balances_block_number_user_address_key" ON "public"."user_balances"("block_number", "user_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_points_block_number_user_address_type_key" ON "public"."user_points"("block_number", "user_address", "type");

-- CreateIndex
CREATE UNIQUE INDEX "points_aggregated_user_address_key" ON "public"."points_aggregated"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_allocation_user_address_key" ON "public"."user_allocation"("user_address");

-- CreateIndex
CREATE UNIQUE INDEX "blocks_block_number_key" ON "public"."blocks"("block_number");

-- CreateIndex
CREATE UNIQUE INDEX "price_info_block_number_key" ON "public"."price_info"("block_number");

-- CreateIndex
CREATE INDEX "price_info_block_number_idx" ON "public"."price_info"("block_number");

-- CreateIndex
CREATE UNIQUE INDEX "dex_positions_user_address_pool_key_timestamp_key" ON "public"."dex_positions"("user_address", "pool_key", "timestamp");

-- CreateIndex
CREATE INDEX "ekubo_positions__cursor_idx" ON "public"."ekubo_positions"("_cursor");

-- CreateIndex
CREATE INDEX "ekubo_positions_timestamp_idx" ON "public"."ekubo_positions"("timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ekubo_positions_block_number_tx_index_event_index_key" ON "public"."ekubo_positions"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "ekubo_nfts__cursor_idx" ON "public"."ekubo_nfts"("_cursor");

-- CreateIndex
CREATE INDEX "ekubo_nfts_nft_id_idx" ON "public"."ekubo_nfts" USING HASH ("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "ekubo_nfts_block_number_tx_index_event_index_key" ON "public"."ekubo_nfts"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "ekubo_position_timeseries_position_id_idx" ON "public"."ekubo_position_timeseries"("position_id");

-- CreateIndex
CREATE INDEX "ekubo_position_timeseries_owner_address_idx" ON "public"."ekubo_position_timeseries"("owner_address");

-- CreateIndex
CREATE INDEX "ekubo_position_timeseries_timestamp_idx" ON "public"."ekubo_position_timeseries"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "block_tx_event_idx" ON "public"."ekubo_position_timeseries"("block_number" DESC, "tx_index" DESC, "event_index" DESC);

-- AddForeignKey
ALTER TABLE "public"."points_aggregated" ADD CONSTRAINT "points_aggregated_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "public"."user_allocation"("user_address") ON DELETE RESTRICT ON UPDATE CASCADE;
