/*
  Warnings:

  - You are about to drop the `ekubo_nfts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ekubo_positions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."blocks" ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "blocks_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."ekubo_nfts";

-- DropTable
DROP TABLE "public"."ekubo_positions";

-- CreateTable
CREATE TABLE "public"."ekubo_positions_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "contract_address" TEXT NOT NULL,
    "token0" TEXT NOT NULL,
    "token1" TEXT NOT NULL,
    "pool_fee" TEXT NOT NULL,
    "pool_tick_spacing" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "lower_bound" INTEGER NOT NULL,
    "upper_bound" INTEGER NOT NULL,
    "liquidity_delta" TEXT NOT NULL,
    "amount0_delta" TEXT NOT NULL,
    "amount1_delta" TEXT NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "ekubo_positions_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ekubo_nfts_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "tx_hash" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "from_address" TEXT NOT NULL,
    "to_address" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "_cursor" BIGINT,

    CONSTRAINT "ekubo_nfts_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ekubo_positions_events__cursor_idx" ON "public"."ekubo_positions_events"("_cursor");

-- CreateIndex
CREATE INDEX "ekubo_positions_events_timestamp_idx" ON "public"."ekubo_positions_events"("timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ekubo_positions_events_block_number_tx_index_event_index_key" ON "public"."ekubo_positions_events"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "ekubo_nfts_events__cursor_idx" ON "public"."ekubo_nfts_events"("_cursor");

-- CreateIndex
CREATE INDEX "ekubo_nfts_events_nft_id_idx" ON "public"."ekubo_nfts_events" USING HASH ("nft_id");

-- CreateIndex
CREATE UNIQUE INDEX "ekubo_nfts_events_block_number_tx_index_event_index_key" ON "public"."ekubo_nfts_events"("block_number", "tx_index", "event_index");

-- AddForeignKey
ALTER TABLE "public"."ekubo_nfts_events" ADD CONSTRAINT "ekubo_nfts_events_block_number_tx_index_event_index_fkey" FOREIGN KEY ("block_number", "tx_index", "event_index") REFERENCES "public"."ekubo_positions_events"("block_number", "tx_index", "event_index") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create function to calculate new final values for position updates
CREATE OR REPLACE FUNCTION calculate_new_final_values(
    current_liquidity TEXT,
    current_amount0 TEXT,
    current_amount1 TEXT,
    liquidity_delta TEXT,
    amount0_delta TEXT,
    amount1_delta TEXT
) RETURNS TABLE(new_liquidity TEXT, new_amount0 TEXT, new_amount1 TEXT) AS $$
DECLARE
    current_liq DECIMAL(78,0) := COALESCE(current_liquidity::DECIMAL(78,0), 0);
    current_amt0 DECIMAL(78,0) := COALESCE(current_amount0::DECIMAL(78,0), 0);
    current_amt1 DECIMAL(78,0) := COALESCE(current_amount1::DECIMAL(78,0), 0);
    liq_delta DECIMAL(78,0) := liquidity_delta::DECIMAL(78,0);
    amt0_delta DECIMAL(78,0) := amount0_delta::DECIMAL(78,0);
    amt1_delta DECIMAL(78,0) := amount1_delta::DECIMAL(78,0);
    new_liq DECIMAL(78,0);
    new_amt0 DECIMAL(78,0);
    new_amt1 DECIMAL(78,0);
BEGIN
    -- Calculate new values
    new_liq := current_liq + liq_delta;
    new_amt0 := current_amt0 + amt0_delta;
    new_amt1 := current_amt1 + amt1_delta;
    
    -- Ensure liquidity cannot be negative
    IF new_liq < 0 THEN
        RAISE EXCEPTION 'Negative liquidity calculated for position';
    END IF;
    
    RETURN QUERY SELECT 
        new_liq::TEXT,
        new_amt0::TEXT,
        new_amt1::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create function to get latest position state from timeseries
CREATE OR REPLACE FUNCTION get_latest_position_state(position_id_param TEXT)
RETURNS TABLE(
    pool_fee TEXT,
    pool_tick_spacing TEXT,
    extension TEXT,
    lower_bound INTEGER,
    upper_bound INTEGER,
    owner_address TEXT,
    liquidity TEXT,
    amount0 TEXT,
    amount1 TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.pool_fee,
        t.pool_tick_spacing,
        t.extension,
        t.lower_bound,
        t.upper_bound,
        t.owner_address,
        t.liquidity,
        t.amount0,
        t.amount1
    FROM ekubo_position_timeseries t
    WHERE t.position_id = position_id_param
    ORDER BY t.block_number DESC, t.tx_index DESC, t.event_index DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle NFT events insert
CREATE OR REPLACE FUNCTION handle_nft_event_insert()
RETURNS TRIGGER AS $$
DECLARE
    from_address_felt TEXT;
    is_nft_mint BOOLEAN;
    latest_state RECORD;
BEGIN
    -- Convert from_address to decimal to check if it's 0 (mint)
    from_address_felt := NEW.from_address::DECIMAL::TEXT;
    is_nft_mint := (from_address_felt = '0');
    
    IF is_nft_mint THEN
        -- Handle NFT mint
        INSERT INTO ekubo_position_timeseries (
            position_id,
            owner_address,
            block_number,
            tx_index,
            event_index,
            timestamp,
            txHash,
            record_type,
            pool_fee,
            pool_tick_spacing,
            extension,
            lower_bound,
            upper_bound,
            liquidity,
            amount0,
            amount1
        ) VALUES (
            NEW.nft_id,
            NEW.to_address,
            NEW.block_number,
            NEW.tx_index,
            NEW.event_index,
            NEW.timestamp,
            NEW.tx_hash,
            'nft_mint',
            NULL,
            NULL,
            NULL,
            NULL,
            NULL,
            '0',
            '0',
            '0'
        );
    ELSE
        -- Handle NFT transfer - get latest state
        SELECT * INTO latest_state FROM get_latest_position_state(NEW.nft_id);
        
        IF latest_state IS NULL THEN
            RAISE EXCEPTION 'Position state not found for position ID %', NEW.nft_id;
        END IF;
        
        INSERT INTO ekubo_position_timeseries (
            position_id,
            owner_address,
            block_number,
            tx_index,
            event_index,
            timestamp,
            txHash,
            record_type,
            pool_fee,
            pool_tick_spacing,
            extension,
            lower_bound,
            upper_bound,
            liquidity,
            amount0,
            amount1
        ) VALUES (
            NEW.nft_id,
            NEW.to_address,
            NEW.block_number,
            NEW.tx_index,
            NEW.event_index,
            NEW.timestamp,
            NEW.tx_hash,
            'nft_transfer',
            latest_state.pool_fee,
            latest_state.pool_tick_spacing,
            latest_state.extension,
            latest_state.lower_bound,
            latest_state.upper_bound,
            COALESCE(latest_state.liquidity, '0'),
            COALESCE(latest_state.amount0, '0'),
            COALESCE(latest_state.amount1, '0')
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle position events insert
CREATE OR REPLACE FUNCTION handle_position_event_insert()
RETURNS TRIGGER AS $$
DECLARE
    latest_state RECORD;
    final_values RECORD;
BEGIN
    -- Get latest position state
    SELECT * INTO latest_state FROM get_latest_position_state(NEW.position_id);
    
    IF latest_state IS NULL THEN
        RAISE EXCEPTION 'Position state not found for position ID %', NEW.position_id;
    END IF;
    
    -- Calculate new final values
    SELECT * INTO final_values FROM calculate_new_final_values(
        COALESCE(latest_state.liquidity, '0'),
        COALESCE(latest_state.amount0, '0'),
        COALESCE(latest_state.amount1, '0'),
        NEW.liquidity_delta,
        NEW.amount0_delta,
        NEW.amount1_delta
    );
    
    INSERT INTO ekubo_position_timeseries (
        position_id,
        owner_address,
        block_number,
        tx_index,
        event_index,
        timestamp,
        txHash,
        record_type,
        pool_fee,
        pool_tick_spacing,
        extension,
        lower_bound,
        upper_bound,
        liquidity,
        amount0,
        amount1
    ) VALUES (
        NEW.position_id,
        latest_state.owner_address,
        NEW.block_number,
        NEW.tx_index,
        NEW.event_index,
        NEW.timestamp,
        NEW.tx_hash,
        'position_updated',
        NEW.pool_fee,
        NEW.pool_tick_spacing,
        NEW.extension,
        NEW.lower_bound,
        NEW.upper_bound,
        final_values.new_liquidity,
        final_values.new_amount0,
        final_values.new_amount1
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle position events update (throw error)
CREATE OR REPLACE FUNCTION handle_position_event_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates to ekubo_positions_events are not allowed';
END;
$$ LANGUAGE plpgsql;

-- Create function to handle position events delete
CREATE OR REPLACE FUNCTION handle_position_event_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete corresponding NFT events
    DELETE FROM ekubo_nfts_events 
    WHERE block_number = OLD.block_number 
    AND tx_index = OLD.tx_index 
    AND event_index = OLD.event_index;
    
    -- Delete corresponding timeseries records
    DELETE FROM ekubo_position_timeseries 
    WHERE block_number = OLD.block_number 
    AND tx_index = OLD.tx_index 
    AND event_index = OLD.event_index;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle NFT events update (throw error)
CREATE OR REPLACE FUNCTION handle_nft_event_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates to ekubo_nfts_events are not allowed';
END;
$$ LANGUAGE plpgsql;

-- Create function to handle NFT events delete
CREATE OR REPLACE FUNCTION handle_nft_event_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete corresponding timeseries records
    DELETE FROM ekubo_position_timeseries 
    WHERE block_number = OLD.block_number 
    AND tx_index = OLD.tx_index 
    AND event_index = OLD.event_index;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for ekubo_nfts_events
CREATE TRIGGER ekubo_nfts_events_insert_trigger
    AFTER INSERT ON ekubo_nfts_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_nft_event_insert();

CREATE TRIGGER ekubo_nfts_events_update_trigger
    AFTER UPDATE ON ekubo_nfts_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_nft_event_update();

CREATE TRIGGER ekubo_nfts_events_delete_trigger
    AFTER DELETE ON ekubo_nfts_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_nft_event_delete();

-- Create triggers for ekubo_positions_events
CREATE TRIGGER ekubo_positions_events_insert_trigger
    AFTER INSERT ON ekubo_positions_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_position_event_insert();

CREATE TRIGGER ekubo_positions_events_update_trigger
    AFTER UPDATE ON ekubo_positions_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_position_event_update();

CREATE TRIGGER ekubo_positions_events_delete_trigger
    AFTER DELETE ON ekubo_positions_events
    FOR EACH ROW
    EXECUTE FUNCTION handle_position_event_delete();
