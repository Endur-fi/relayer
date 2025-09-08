/*
  Warnings:

  - You are about to drop the column `_cursor` on the `withdraw_queue` table. All the data in the column will be lost.
  - You are about to drop the column `asset` on the `withdraw_queue` table. All the data in the column will be lost.
  - You are about to drop the column `block_number` on the `withdraw_queue` table. All the data in the column will be lost.
  - You are about to drop the column `event_index` on the `withdraw_queue` table. All the data in the column will be lost.
  - You are about to drop the column `tx_index` on the `withdraw_queue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiver,queue_contract,request_id]` on the table `withdraw_queue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `queue_contract` to the `withdraw_queue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "withdraw_queue__cursor_idx";

-- DropIndex
DROP INDEX "withdraw_queue_block_number_tx_index_event_index_key";

-- AlterTable
ALTER TABLE "withdraw_queue" DROP COLUMN "_cursor",
DROP COLUMN "asset",
DROP COLUMN "block_number",
DROP COLUMN "event_index",
DROP COLUMN "tx_index",
ADD COLUMN     "queue_contract" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "withdraw_queue_events" (
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
    "_cursor" BIGINT
);

-- CreateIndex
CREATE INDEX "withdraw_queue_events__cursor_idx" ON "withdraw_queue_events"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "withdraw_queue_events_block_number_tx_index_event_index_key" ON "withdraw_queue_events"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE UNIQUE INDEX "withdraw_queue_receiver_queue_contract_request_id_key" ON "withdraw_queue"("receiver", "queue_contract", "request_id");

-- Create trigger function for withdraw_queue_events
CREATE OR REPLACE FUNCTION update_withdraw_queue_from_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT and UPDATE operations
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO withdraw_queue (
            tx_hash,
            queue_contract,
            amount,
            amount_lst,
            request_id,
            is_claimed,
            claim_time,
            receiver,
            caller,
            cumulative_requested_amount_snapshot,
            is_rejected,
            is_notified,
            timestamp
        ) VALUES (
            NEW.tx_hash,
            NEW.queue_contract,
            NEW.amount,
            NEW.amount_lst,
            NEW.request_id,
            NEW.is_claimed,
            NEW.claim_time,
            NEW.receiver,
            NEW.caller,
            NEW.cumulative_requested_amount_snapshot,
            false, -- is_rejected defaults to false on insert
            false, -- is_notified defaults to false on insert
            NEW.timestamp
        )
        ON CONFLICT (receiver, queue_contract, request_id) 
        DO UPDATE SET
            tx_hash = EXCLUDED.tx_hash,
            amount = EXCLUDED.amount,
            amount_lst = EXCLUDED.amount_lst,
            is_claimed = EXCLUDED.is_claimed,
            claim_time = EXCLUDED.claim_time,
            caller = EXCLUDED.caller,
            cumulative_requested_amount_snapshot = EXCLUDED.cumulative_requested_amount_snapshot,
            timestamp = EXCLUDED.timestamp;
            -- Note: is_rejected and is_notified are not updated to preserve external state
        
        RETURN NEW;
    END IF;
    
    -- Handle DELETE operations
    IF TG_OP = 'DELETE' THEN
        -- Find the most recent non-deleted event for the same receiver, queue_contract, request_id
        -- and update the withdraw_queue record with that data
        UPDATE withdraw_queue 
        SET 
            tx_hash = latest_event.tx_hash,
            amount = latest_event.amount,
            amount_lst = latest_event.amount_lst,
            is_claimed = latest_event.is_claimed,
            claim_time = latest_event.claim_time,
            caller = latest_event.caller,
            cumulative_requested_amount_snapshot = latest_event.cumulative_requested_amount_snapshot,
            timestamp = latest_event.timestamp
        FROM (
            SELECT 
                tx_hash,
                amount,
                amount_lst,
                is_claimed,
                claim_time,
                caller,
                cumulative_requested_amount_snapshot,
                timestamp
            FROM withdraw_queue_events 
            WHERE receiver = OLD.receiver 
                AND queue_contract = OLD.queue_contract 
                AND request_id = OLD.request_id
            ORDER BY timestamp DESC, block_number DESC, tx_index DESC, event_index DESC
            LIMIT 1
        ) AS latest_event
        WHERE withdraw_queue.receiver = OLD.receiver 
            AND withdraw_queue.queue_contract = OLD.queue_contract 
            AND withdraw_queue.request_id = OLD.request_id;
        
        -- If no more events exist for this combination, delete the withdraw_queue record
        DELETE FROM withdraw_queue 
        WHERE receiver = OLD.receiver 
            AND queue_contract = OLD.queue_contract 
            AND request_id = OLD.request_id
            AND NOT EXISTS (
                SELECT 1 FROM withdraw_queue_events 
                WHERE receiver = OLD.receiver 
                    AND queue_contract = OLD.queue_contract 
                    AND request_id = OLD.request_id
            );
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on withdraw_queue_events table
CREATE TRIGGER withdraw_queue_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON withdraw_queue_events
    FOR EACH ROW
    EXECUTE FUNCTION update_withdraw_queue_from_events();
