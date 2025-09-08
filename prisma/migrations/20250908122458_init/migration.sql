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
    "asset" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "amount_lst" TEXT NOT NULL,
    "request_id" BIGINT NOT NULL,
    "is_claimed" BOOLEAN NOT NULL,
    "claim_time" INTEGER NOT NULL,
    "receiver" TEXT NOT NULL,
    "cumulative_requested_amount_snapshot" TEXT NOT NULL,
    "is_rejected" BOOLEAN NOT NULL DEFAULT false,
    "is_notified" BOOLEAN NOT NULL DEFAULT false,
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
    "email" TEXT,
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

-- CreateTable
CREATE TABLE "ekubo_positions" (
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
CREATE TABLE "ekubo_nfts" (
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
CREATE TABLE "ekubo_position_timeseries" (
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

-- CreateIndex
CREATE INDEX "ekubo_positions__cursor_idx" ON "ekubo_positions"("_cursor");

-- CreateIndex
CREATE INDEX "ekubo_positions_timestamp_idx" ON "ekubo_positions"("timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ekubo_positions_block_number_tx_index_event_index_key" ON "ekubo_positions"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "ekubo_nfts__cursor_idx" ON "ekubo_nfts"("_cursor");

-- CreateIndex
CREATE INDEX "ekubo_nfts_nft_id_idx" ON "ekubo_nfts" USING HASH ("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "ekubo_nfts_block_number_tx_index_event_index_key" ON "ekubo_nfts"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "ekubo_position_timeseries_position_id_idx" ON "ekubo_position_timeseries"("position_id");

-- CreateIndex
CREATE INDEX "ekubo_position_timeseries_owner_address_idx" ON "ekubo_position_timeseries"("owner_address");

-- CreateIndex
CREATE INDEX "ekubo_position_timeseries_timestamp_idx" ON "ekubo_position_timeseries"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "block_tx_event_idx" ON "ekubo_position_timeseries"("block_number" DESC, "tx_index" DESC, "event_index" DESC);

-- AddForeignKey
ALTER TABLE "points_aggregated" ADD CONSTRAINT "points_aggregated_user_address_fkey" FOREIGN KEY ("user_address") REFERENCES "user_allocation"("user_address") ON DELETE RESTRICT ON UPDATE CASCADE;


-- FUNCTION: On insert into ekubo_nfts, update user_address in ekubo_positions
CREATE OR REPLACE FUNCTION update_user_address_from_nfts()
RETURNS TRIGGER AS $$
BEGIN

  -- Debug: Log the NEW record fields
  RAISE NOTICE 'NFT Transfer';
  RAISE NOTICE 'NFT Transfer - From: %, To: %, NFT ID: %', NEW["from"], NEW.to, NEW.nft_id;

  -- Try to update existing row
  UPDATE ekubo_positions
  SET user_address = NEW.to,
      updated_at = now()
  WHERE position_id = NEW.nft_id;

  -- If no row was updated, insert a dummy row
  IF NOT FOUND THEN
    INSERT INTO ekubo_positions (
      pool_fee,
      pool_tick_spacing,
      extension,
      position_id,
      user_address,
      block_number,
      tx_index,
      event_index,
      timestamp,
      "txHash",
      lower_bound,
      upper_bound,
      created_at,
      updated_at
    ) VALUES (
      'dummy_fee',
      'dummy_spacing',
      'dummy_ext',
      NEW.nft_id,
      NEW.to,
      NEW.block_number,
      NEW.tx_index,
      NEW.event_index,
      NEW.timestamp,
      NEW."txHash",
      0,
      0,
      now(),
      now()
    );
  END IF;

  -- Cancel insert into ekubo_nfts
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: After insert on ekubo_nfts
CREATE TRIGGER trg_update_user_address
BEFORE INSERT ON ekubo_nfts
FOR EACH ROW
EXECUTE FUNCTION update_user_address_from_nfts();

-- TRIGGER: After insert on ekubo_nfts
CREATE OR REPLACE VIEW ekubo_positions_view AS
SELECT * FROM ekubo_positions;

CREATE OR REPLACE FUNCTION upsert_ekubo_positions_view()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'Inserting/upserting position: %, %, %, %',
  NEW.pool_fee, NEW.pool_tick_spacing, NEW.extension, NEW.position_id;
  
  INSERT INTO ekubo_positions (
    pool_fee, pool_tick_spacing, extension, position_id, user_address,
    block_number, tx_index, event_index, timestamp, "txHash", _cursor, created_at, updated_at,
	lower_bound, upper_bound
  )
  VALUES (
    NEW.pool_fee, NEW.pool_tick_spacing, NEW.extension, NEW.position_id, NEW.user_address,
    NEW.block_number, NEW.tx_index, NEW.event_index, NEW.timestamp, NEW."txHash", NEW._cursor, now(), now(),
	NEW.lower_bound, NEW.upper_bound
  )
  ON CONFLICT (pool_fee, pool_tick_spacing, extension, position_id)
  DO UPDATE SET
    block_number = EXCLUDED.block_number,
    tx_index = EXCLUDED.tx_index,
    event_index = EXCLUDED.event_index,
    timestamp = EXCLUDED.timestamp,
    "txHash" = EXCLUDED."txHash",
	lower_bound = EXCLUDED.lower_bound,
	upper_bound = EXCLUDED.upper_bound,
    updated_at = now(),
    _cursor = EXCLUDED._cursor;

  RETURN NULL;  -- Prevent insert into the view (which is virtual)
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_upsert_ekubo_positions_view
INSTEAD OF INSERT ON ekubo_positions_view
FOR EACH ROW
EXECUTE FUNCTION upsert_ekubo_positions_view();



-- This script ensures duplicates are not inserted into the blocks table
CREATE OR REPLACE FUNCTION soft_blocks_reject_on_conflict()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM blocks WHERE block_number = NEW.block_number) THEN
        -- You could raise a NOTICE instead of an error
        RAISE NOTICE 'blocks Soft reject: ADDR % already exists', NEW.block_number;
        RETURN NULL; -- Skip the insert
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_blocks_insert_soft_reject
BEFORE INSERT ON blocks
FOR EACH ROW
EXECUTE FUNCTION soft_blocks_reject_on_conflict();


CREATE OR REPLACE FUNCTION soft_reject_on_conflict()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE user_address = NEW.user_address) THEN
        -- You could raise a NOTICE instead of an error
        RAISE NOTICE 'Users Soft reject: ADDR % already exists', NEW.user_address;
        RETURN NULL; -- Skip the insert
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_soft_reject
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION soft_reject_on_conflict();

