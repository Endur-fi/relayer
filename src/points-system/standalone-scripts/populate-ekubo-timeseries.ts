import {
  ekubo_nfts,
  ekubo_position_timeseries,
  ekubo_positions,
  PrismaClient,
} from "@prisma/client";
import { logger, Web3Number } from "@strkfarm/sdk";
import { num } from "starknet";

const prisma = new PrismaClient();

declare global {
  interface BigInt {
    toJSON(): string;
  }
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

interface TimelineEvent {
  type: "nft_transfer" | "position_update";
  timestamp: number;
  block_number: number;
  tx_index: number;
  event_index: number;
  txHash: string;
  data: any;
}

interface PositionState {
  pool_fee?: string;
  pool_tick_spacing?: string;
  extension?: string;
  lower_bound?: number;
  upper_bound?: number;
  owner_address?: string;
  has_position_data?: boolean;
  // Final calculated values
  liquidity?: string;
  amount0?: string;
  amount1?: string;
}

/**
 *
 * @returns
 */
async function getIndexersState() {
  const resp = await fetch(
    "https://enurfi-indexers-with-health-api-mainnet.onrender.com/summary"
  );
  const data = await resp.json();
  const positionIndex = data.results.find(
    (i: any) => i.file == "apibara:sink:relayer::ekubo::positions"
  );
  const nftIndex = data.results.find(
    (i: any) => i.file == "apibara:sink:relayer::ekubo::nfts"
  );
  if (!positionIndex || !nftIndex) {
    throw new Error("Ekubo indexers not found");
  }

  return Math.min(
    positionIndex.status.cursor.orderKey,
    nftIndex.status.cursor.orderKey
  );
}

/**
 * Determines the last processed event for incremental updates
 */
async function getLastProcessedEvent(): Promise<{
  blockNumber: number;
  txIndex: number;
  eventIndex: number;
} | null> {
  const latestRecord = await prisma.ekubo_position_timeseries.findFirst({
    orderBy: [
      { block_number: "desc" },
      { tx_index: "desc" },
      { event_index: "desc" },
    ],
  });

  if (!latestRecord) {
    return null;
  }

  return {
    blockNumber: latestRecord.block_number,
    txIndex: latestRecord.tx_index,
    eventIndex: latestRecord.event_index,
  };
}

/**
 * Fetches NFT transfers, optionally filtered for incremental updates
 */
async function fetchNftTransfers(lastProcessed?: {
  blockNumber: number;
  txIndex: number;
  eventIndex: number;
}) {
  return await prisma.ekubo_nfts.findMany({
    where: lastProcessed
      ? {
          OR: [
            { block_number: { gt: lastProcessed.blockNumber } },
            {
              AND: [
                { block_number: lastProcessed.blockNumber },
                { tx_index: { gt: lastProcessed.txIndex } },
              ],
            },
            {
              AND: [
                { block_number: lastProcessed.blockNumber },
                { tx_index: lastProcessed.txIndex },
                { event_index: { gt: lastProcessed.eventIndex } },
              ],
            },
          ],
        }
      : undefined,
    orderBy: [
      { block_number: "asc" },
      { tx_index: "asc" },
      { event_index: "asc" },
    ],
  });
}

/**
 * Fetches position updates, optionally filtered for incremental updates
 */
async function fetchPositionUpdates(lastProcessed?: {
  blockNumber: number;
  txIndex: number;
  eventIndex: number;
}) {
  return await prisma.ekubo_positions.findMany({
    where: lastProcessed
      ? {
          OR: [
            { block_number: { gt: lastProcessed.blockNumber } },
            {
              AND: [
                { block_number: lastProcessed.blockNumber },
                { tx_index: { gt: lastProcessed.txIndex } },
              ],
            },
            {
              AND: [
                { block_number: lastProcessed.blockNumber },
                { tx_index: lastProcessed.txIndex },
                { event_index: { gt: lastProcessed.eventIndex } },
              ],
            },
          ],
        }
      : undefined,
    orderBy: [
      { block_number: "asc" },
      { tx_index: "asc" },
      { event_index: "asc" },
    ],
  });
}

/**
 * Creates a chronologically sorted timeline of all events
 */
async function createEventTimeline(
  nftTransfers: ekubo_nfts[],
  positionUpdates: ekubo_positions[]
): Promise<TimelineEvent[]> {
  const timeline: TimelineEvent[] = [];

  // const lastBlockOfNFTTransfers = nftTransfers.length > 0 ? nftTransfers[nftTransfers.length - 1].block_number : 0;
  // const lastBlockOfPositionUpdates = positionUpdates.length > 0 ? positionUpdates[positionUpdates.length - 1].block_number : 0;

  // we need full data of both events, for simplicity, we remove all events from all block
  const lastIndexedBlock = await getIndexersState();
  console.log("Last indexed block:", lastIndexedBlock);
  const minLastBlock = lastIndexedBlock;
  if (minLastBlock === 0) {
    return timeline; // No events to process
  }
  // Filter out events that are not before the minimum last block
  nftTransfers = nftTransfers.filter((nft) => nft.block_number < minLastBlock);
  positionUpdates = positionUpdates.filter((position) => {
    // position id 0 is possible on initialization, so we dont want to keep it
    return position.block_number < minLastBlock && position.position_id != "0";
  });

  // Add NFT transfers to timeline
  nftTransfers.forEach((nft) => {
    timeline.push({
      type: "nft_transfer",
      timestamp: nft.timestamp,
      block_number: nft.block_number,
      tx_index: nft.tx_index,
      event_index: nft.event_index,
      txHash: nft.txHash,
      data: nft,
    });
  });

  // Add position updates to timeline
  positionUpdates.forEach((position) => {
    timeline.push({
      type: "position_update",
      timestamp: position.timestamp,
      block_number: position.block_number,
      tx_index: position.tx_index,
      event_index: position.event_index,
      txHash: position.txHash,
      data: position,
    });
  });

  // we want to remove nfts which dont have position data
  const nftIdsWithPositionData = new Set(
    positionUpdates.map((p) => p.position_id)
  );
  const timelineUpdated = timeline.filter((event) => {
    return !(
      event.type === "nft_transfer" &&
      !nftIdsWithPositionData.has(event.data.nft_id)
    );
  });

  // Sort timeline by block_number, tx_index, event_index (not timestamp)
  timelineUpdated.sort((a, b) => {
    if (a.block_number !== b.block_number)
      return a.block_number - b.block_number;
    if (a.tx_index !== b.tx_index) return a.tx_index - b.tx_index;
    return a.event_index - b.event_index;
  });

  return timelineUpdated;
}

/**
 * Processes an NFT mint efvent with transaction
 */
async function processNftMint(
  tx: any,
  nft: any,
  positionStates: Map<string, PositionState>
) {
  await tx.ekubo_position_timeseries.create({
    data: {
      position_id: nft.nft_id,
      owner_address: nft.to_address,
      block_number: nft.block_number,
      tx_index: nft.tx_index,
      event_index: nft.event_index,
      timestamp: nft.timestamp,
      txHash: nft.txHash,
      record_type: "nft_mint",
      // Pool info and bounds are null for mint
      pool_fee: null,
      pool_tick_spacing: null,
      extension: null,
      lower_bound: null,
      upper_bound: null,
      // Initialize final calculated values to 0
      liquidity: Web3Number.fromWei("0", 18).toWei(),
      amount0: Web3Number.fromWei("0", 18).toWei(),
      amount1: Web3Number.fromWei("0", 18).toWei(),
    },
  });

  // Initialize position state
  positionStates.set(nft.nft_id, {
    owner_address: nft.to_address,
    has_position_data: false,
    // Initialize final values
    liquidity: Web3Number.fromWei("0", 18).toWei(),
    amount0: Web3Number.fromWei("0", 18).toWei(),
    amount1: Web3Number.fromWei("0", 18).toWei(),
  });
}

/**
 * Processes an NFT transfer event with transaction
 */
async function processNftTransfer(
  tx: any,
  nft: any,
  positionStates: Map<string, PositionState>
) {
  let currentState = positionStates.get(nft.nft_id);
  if (!currentState) {
    currentState = await loadPositionStateFromDb(nft.nft_id);
    if (!currentState) {
      throw new Error(`Position state not found for position ID ${nft.nft_id}`);
    }
    positionStates.set(nft.nft_id, currentState);
  }

  await tx.ekubo_position_timeseries.create({
    data: {
      position_id: nft.nft_id,
      owner_address: nft.to_address,
      block_number: nft.block_number,
      tx_index: nft.tx_index,
      event_index: nft.event_index,
      timestamp: nft.timestamp,
      txHash: nft.txHash,
      record_type: "nft_transfer",
      // Carry forward existing position data
      pool_fee: currentState.pool_fee || null,
      pool_tick_spacing: currentState.pool_tick_spacing || null,
      extension: currentState.extension || null,
      lower_bound: currentState.lower_bound || null,
      upper_bound: currentState.upper_bound || null,
      // Carry forward existing final calculated values
      liquidity: currentState.liquidity || Web3Number.fromWei("0", 18).toWei(),
      amount0: currentState.amount0 || Web3Number.fromWei("0", 18).toWei(),
      amount1: currentState.amount1 || Web3Number.fromWei("0", 18).toWei(),
    },
  });

  // Update position state
  positionStates.set(nft.nft_id, {
    ...currentState,
    owner_address: nft.to_address,
  });
}

/**
 * Processes a position update event with transaction
 */
async function processPositionUpdate(
  tx: any,
  position: any,
  positionStates: Map<string, PositionState>
) {
  let currentState = positionStates.get(position.position_id);
  if (!currentState) {
    currentState = await loadPositionStateFromDb(position.position_id);
    if (!currentState) {
      throw new Error(
        `Position state not found for position ID ${position.position_id}`
      );
    }
    positionStates.set(position.position_id, currentState);
  }

  // Calculate new final values using Web3Number operations
  const finalValues = calculateNewFinalValues(
    currentState,
    position.liquidity_delta,
    position.amount0_delta,
    position.amount1_delta
  );

  const recordType = "position_updated";

  await tx.ekubo_position_timeseries.create({
    data: {
      position_id: position.position_id,
      owner_address: currentState.owner_address,
      block_number: position.block_number,
      tx_index: position.tx_index,
      event_index: position.event_index,
      timestamp: position.timestamp,
      txHash: position.txHash,
      record_type: recordType,
      // Position data from the position update
      pool_fee: position.pool_fee,
      pool_tick_spacing: position.pool_tick_spacing,
      extension: position.extension,
      lower_bound: position.lower_bound,
      upper_bound: position.upper_bound,
      // Final calculated values
      liquidity: finalValues.liquidity,
      amount0: finalValues.amount0,
      amount1: finalValues.amount1,
    },
  });

  // Update position state with new final values
  positionStates.set(position.position_id, {
    ...currentState,
    pool_fee: position.pool_fee,
    pool_tick_spacing: position.pool_tick_spacing,
    extension: position.extension,
    lower_bound: position.lower_bound,
    upper_bound: position.upper_bound,
    has_position_data: true,
    // Update final values in memory
    liquidity: finalValues.liquidity,
    amount0: finalValues.amount0,
    amount1: finalValues.amount1,
  });
}

/**
 * Loads position state from the database if not found in memory
 */
async function loadPositionStateFromDb(
  positionId: string
): Promise<PositionState | undefined> {
  const latestRecord = await prisma.ekubo_position_timeseries.findFirst({
    where: { position_id: positionId },
    orderBy: [
      { block_number: "desc" },
      { tx_index: "desc" },
      { event_index: "desc" },
    ],
  });

  if (!latestRecord) {
    return undefined;
  }

  return {
    pool_fee: latestRecord.pool_fee || undefined,
    pool_tick_spacing: latestRecord.pool_tick_spacing || undefined,
    extension: latestRecord.extension || undefined,
    lower_bound: latestRecord.lower_bound || undefined,
    upper_bound: latestRecord.upper_bound || undefined,
    owner_address: latestRecord.owner_address || undefined,
    has_position_data: !!latestRecord.pool_fee,
    // Load final calculated values
    liquidity: latestRecord.liquidity || "0",
    amount0: latestRecord.amount0 || "0",
    amount1: latestRecord.amount1 || "0",
  };
}

/**
 * Calculates new final values by applying deltas to current values
 */
function calculateNewFinalValues(
  currentState: PositionState,
  liquidityDelta: string,
  amount0Delta: string,
  amount1Delta: string
): { liquidity: string; amount0: string; amount1: string } {
  // Current values (default to 0 if not set)
  const currentLiquidity = Web3Number.fromWei(
    currentState.liquidity || "0",
    18
  );
  const currentAmount0 = Web3Number.fromWei(currentState.amount0 || "0", 18);
  const currentAmount1 = Web3Number.fromWei(currentState.amount1 || "0", 18);

  // Deltas
  const liquidityDeltaWeb3 = Web3Number.fromWei(liquidityDelta, 18);
  const amount0DeltaWeb3 = Web3Number.fromWei(amount0Delta, 18);
  const amount1DeltaWeb3 = Web3Number.fromWei(amount1Delta, 18);

  // Calculate new values
  // console.log(`Calculating new final values for position ${currentState.owner_address}:
  //   Current Liquidity: ${currentLiquidity.toString()},
  //   Liquidity Delta: ${liquidityDeltaWeb3.toString()},
  //   Current Amount0: ${currentAmount0.toString()},
  //   Amount0 Delta: ${amount0DeltaWeb3.toString()},
  //   Current Amount1: ${currentAmount1.toString()},
  //   Amount1 Delta: ${amount1DeltaWeb3.toString()}`);
  const newLiquidity = liquidityDeltaWeb3.eq(0)
    ? currentLiquidity
    : currentLiquidity.plus(liquidityDeltaWeb3.toString());
  const newAmount0 = amount0DeltaWeb3.eq(0)
    ? currentAmount0
    : currentAmount0.plus(amount0DeltaWeb3.toString());
  const newAmount1 = amount1DeltaWeb3.eq(0)
    ? currentAmount1
    : currentAmount1.plus(amount1DeltaWeb3.toString());

  // Ensure liquidity cannot be negative
  if (newLiquidity.lt(Web3Number.fromWei("0", 18))) {
    throw new Error(
      `Negative liquidity calculated for position ${currentState.owner_address}`
    );
  }

  return {
    liquidity: newLiquidity.toWei(),
    amount0: newAmount0.toWei(),
    amount1: newAmount1.toWei(),
  };
}

/**
 * Processes a batch of events in a single transaction
 */
async function processBatch(
  eventBatch: TimelineEvent[],
  positionStates: Map<string, PositionState>
): Promise<void> {
  await prisma.$transaction(
    async (tx) => {
      for (const event of eventBatch) {
        try {
          if (event.type === "nft_transfer") {
            const nft = event.data;
            const fromAddressFelt = num.getDecimalString(nft.from_address);
            const isNftMint = fromAddressFelt === "0";

            if (isNftMint) {
              await processNftMint(tx, nft, positionStates);
            } else {
              await processNftTransfer(tx, nft, positionStates);
            }
          } else if (event.type === "position_update") {
            await processPositionUpdate(tx, event.data, positionStates);
          }
        } catch (err) {
          logger.error(
            `Processing event: ${event.type} at with id ${event.data.nft_id || event.data.position_id}, full event: ${JSON.stringify(event)}`,
            err
          );
          throw err;
        }
      }
    },
    { timeout: 100000 }
  ); // Set a reasonable timeout for the transaction
}

/**
 * Processes all events in the timeline using batched transactions
 */
async function processEventTimeline(timeline: TimelineEvent[]): Promise<void> {
  const positionStates = new Map<string, PositionState>();
  const BATCH_SIZE = 50;
  let processedCount = 0;

  console.log(
    `Processing ${timeline.length} events in batches of ${BATCH_SIZE}`
  );

  for (let i = 0; i < timeline.length; i += BATCH_SIZE) {
    const batch = timeline.slice(i, i + BATCH_SIZE);

    try {
      await processBatch(batch, positionStates);
      processedCount += batch.length;

      console.log(
        `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(timeline.length / BATCH_SIZE)} (${processedCount}/${timeline.length} events)`
      );
    } catch (error) {
      console.error(`Error processing batch starting at index ${i}:`, error);
      throw error;
    }
  }

  console.log(
    "Processed all events in chronological order with batched transactions"
  );
}

/**
 * Generates and displays statistics about the populated data
 */
async function displayStatistics(): Promise<void> {
  // Get final count and statistics
  const timeseriesCount = await prisma.ekubo_position_timeseries.count();
  console.log(
    `Successfully populated ekubo_position_timeseries with ${timeseriesCount} records`
  );

  // Show breakdown by record type
  const recordTypeCounts = await prisma.ekubo_position_timeseries.groupBy({
    by: ["record_type"],
    _count: {
      id: true,
    },
  });

  console.log("\nRecord type breakdown:");
  recordTypeCounts.forEach(({ record_type, _count }) => {
    console.log(`${record_type}: ${_count.id}`);
  });

  // Show some sample records
  console.log("\nSample records:");

  const sampleMint = await prisma.ekubo_position_timeseries.findFirst({
    where: { record_type: "nft_mint" },
    orderBy: { timestamp: "asc" },
  });
  if (sampleMint) {
    console.log("Sample NFT Mint:", {
      position_id: sampleMint.position_id,
      owner: sampleMint.owner_address,
      timestamp: new Date(sampleMint.timestamp * 1000).toISOString(),
      has_position_data: !!sampleMint.pool_fee,
    });
  }

  const samplePositionCreated =
    await prisma.ekubo_position_timeseries.findFirst({
      where: { record_type: "position_created" },
      orderBy: { timestamp: "asc" },
    });
  if (samplePositionCreated) {
    console.log("Sample Position Created:", {
      position_id: samplePositionCreated.position_id,
      owner: samplePositionCreated.owner_address,
      timestamp: new Date(samplePositionCreated.timestamp * 1000).toISOString(),
      bounds: `[${samplePositionCreated.lower_bound}, ${samplePositionCreated.upper_bound}]`,
    });
  }

  // Check for positions without owners
  const orphanedPositions = await prisma.ekubo_position_timeseries.count({
    where: { owner_address: "unknown" },
  });
  if (orphanedPositions > 0) {
    console.log(
      `⚠️  Found ${orphanedPositions} position records without known owners`
    );
  }
}

/**
 * Main function to populate the ekubo position timeseries table
 */
async function populateEkuboTimeseries(incremental = false) {
  console.log(
    `Starting to populate ekubo_position_timeseries table (incremental: ${incremental})...`
  );

  try {
    let lastProcessed: {
      blockNumber: number;
      txIndex: number;
      eventIndex: number;
    } | null = null;

    if (incremental) {
      // Find the latest processed event to resume from
      lastProcessed = await getLastProcessedEvent();

      if (lastProcessed) {
        console.log(
          `Resuming from block: ${lastProcessed.blockNumber}, tx: ${lastProcessed.txIndex}, event: ${lastProcessed.eventIndex}`
        );
      } else {
        console.log("No existing records found, doing full rebuild");
        incremental = false;
      }
    } else {
      // Clear existing data in the timeseries table
      await prisma.ekubo_position_timeseries.deleteMany();
      console.log("Cleared existing timeseries data");
    }

    // Fetch data
    const nftTransfers = await fetchNftTransfers(lastProcessed || undefined);
    const positionUpdates = await fetchPositionUpdates(
      lastProcessed || undefined
    );

    console.log(
      `Found ${nftTransfers.length} NFT transfers and ${positionUpdates.length} position updates`
    );

    if (
      incremental &&
      nftTransfers.length === 0 &&
      positionUpdates.length === 0
    ) {
      console.log("No new events to process");
      return;
    }

    // Create timeline and process events
    const timeline = await createEventTimeline(nftTransfers, positionUpdates);
    console.log(`Created timeline with ${timeline.length} total events`);

    await processEventTimeline(timeline);
    await displayStatistics();
  } catch (error) {
    console.error("Error populating ekubo timeseries:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  const fromStart = process.argv.includes("--from-start");
  populateEkuboTimeseries(!fromStart)
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { populateEkuboTimeseries };
