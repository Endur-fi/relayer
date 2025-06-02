-- AlterEnum
ALTER TYPE "UserPointsType" ADD VALUE 'Referrer';

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
