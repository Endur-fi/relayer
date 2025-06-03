-- AlterEnum
ALTER TYPE "UserPointsType" ADD VALUE 'Referrer';
ALTER TYPE "UserPointsType" ADD VALUE 'Priority';
ALTER TYPE "UserPointsType" ADD VALUE 'Early';

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

-- CreateIndex
CREATE INDEX "transfer__cursor_idx" ON "transfer"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_block_number_tx_index_event_index_key" ON "transfer"("block_number", "tx_index", "event_index");

-- creates trigger to avoid duplicate entries in the users table
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

-- creates trigger to avoid duplicate entries in the blocks table
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
