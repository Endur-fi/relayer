import { PrismaClient, users } from "@prisma/client";
import axios from "axios";
import pLimit from "p-limit";

const prisma = new PrismaClient();
const API_BASE_URL = "http://localhost:3000/api/block-holdings";
const DB_BATCH_SIZE = 100; // no of records to insert at once
const GLOBAL_CONCURRENCY_LIMIT = 5; // total concurrent API calls allowed
const MAX_RETRIES = 3; // max number of retry attempts
const RETRY_DELAY = 5000; // 5 seconds delay between retries

const globalLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

const POINTS_MULTIPLIER = 1;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// rough test calculation of points based on user balances
function calculatePoints(totalAmount: string): BigInt {
  const amount = parseFloat(totalAmount);
  const points = Math.floor((amount / 1e18) * POINTS_MULTIPLIER);
  return BigInt(points);
}

async function fetchHoldingsWithRetry(
  userAddr: string,
  date: Date
): Promise<any | null> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const timestamp = Math.floor(date.getTime() / 1000);
      const thirtyMinBefore = timestamp - 1800;
      const blockInfo = await prisma.blocks.findFirst({
        where: {
          timestamp: {
            lte: timestamp,
            gte: thirtyMinBefore,
          },
        },
        orderBy: {
          timestamp: "desc",
        },
      });
      console.log(blockInfo, "blockInfo------");

      if (!blockInfo || !blockInfo.block_number) {
        throw new Error(
          `No block found for user ${userAddr} on date: ${
            date.toISOString().split("T")[0]
          }`
        );
      }

      const url = `${API_BASE_URL}/${userAddr}/${blockInfo.block_number}`;

      const response = await axios.get(url);
      const data = response.data;

      if (!data.blocks || !data.blocks[0]) {
        console.warn(
          `Invalid data format for user ${userAddr} on date: ${
            date.toISOString().split("T")[0]
          }`
        );
        return null;
      }

      let totalAmount = 0;
      const dapps = [
        "vesu",
        "ekubo",
        "nostraLending",
        "nostraDex",
        "wallet",
        "strkfarm",
      ];

      const dbObject = {
        user_address: userAddr,
        block_number: Number(data.blocks[0].block),
        vesuAmount: "0",
        ekuboAmount: "0",
        nostraLendingAmount: "0",
        nostraDexAmount: "0",
        walletAmount: "0",
        strkfarmAmount: "0",
        total_amount: "0",
        date: date.toISOString().split("T")[0],
        timestamp: timestamp,
      };

      for (let dapp of dapps) {
        if (!data[dapp] || !data[dapp][0]) {
          throw new Error(
            `Invalid data format for dapp ${dapp} for user ${userAddr} on date: ${
              date.toISOString().split("T")[0]
            }`
          );
        }

        const xSTRKAmount =
          Number(
            Number(data[dapp][0].xSTRKAmount.bigNumber * 100) /
              10 ** data[dapp][0].xSTRKAmount.decimals
          ) / 100;
        totalAmount += xSTRKAmount;
        dbObject[`${dapp}Amount`] = xSTRKAmount.toString();
      }

      dbObject.total_amount = totalAmount.toString();
      return dbObject;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error(
          `Failed after ${MAX_RETRIES} attempts for user ${userAddr} on date ${
            date.toISOString().split("T")[0]
          }: ${error.message}`
        );
        return null;
      }
      console.warn(
        `Attempt ${retries}/${MAX_RETRIES} failed for user ${userAddr} on date ${
          date.toISOString().split("T")[0]
        }: ${error.message}. Retrying in ${RETRY_DELAY / 1000}s...`
      );
      await sleep(RETRY_DELAY);
    }
  }

  return null;
}

async function updatePointsAggregated(userBalance: any): Promise<void> {
  if (!userBalance) return;

  const userAddr = userBalance.user_address;
  const blockNumber = userBalance.block_number;
  const timestamp = userBalance.timestamp;

  const newPoints = calculatePoints(userBalance.total_amount);

  try {
    // check if user already has points aggregated
    const existingRecord = await prisma.points_aggregated.findUnique({
      where: {
        user_address: userAddr,
      },
    });

    if (existingRecord) {
      // Update existing record
      await prisma.points_aggregated.update({
        where: {
          user_address: userAddr,
        },
        data: {
          total_points: newPoints as bigint,
          block_number: blockNumber,
          timestamp: timestamp,
          // updated_on will be automatically updated due to @updatedAt decorator
        },
      });
      console.log(`Updated points_aggregated for user ${userAddr}`);
    } else {
      // Create new record
      await prisma.points_aggregated.create({
        data: {
          user_address: userAddr,
          total_points: newPoints as bigint,
          block_number: blockNumber,
          timestamp: timestamp,
          // created_on will be automatically set due to @default(now()) decorator
        },
      });
      console.log(`Created points_aggregated for user ${userAddr}`);
    }
  } catch (error) {
    console.error(
      `Error updating points_aggregated for user ${userAddr}:`,
      error
    );
  }
}

async function getAllTasks(): Promise<[string, Date][]> {
  const allUsers = await prisma.users.findMany({
    select: {
      user_address: true,
    },
  });

  console.log(`Found ${allUsers.length} users to process`);

  const startDate = new Date("2024-11-24");
  const endDate = new Date("2024-12-05");

  const allTasks: [string, Date][] = [];

  for (const user of allUsers) {
    const lastStoredRecord = await prisma.user_balances.findFirst({
      where: {
        user_address: user.user_address,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        date: true,
      },
    });

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      if (lastStoredRecord && lastStoredRecord.date >= dateString) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      allTasks.push([user.user_address, new Date(currentDate)]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  console.log(`Total tasks to process: ${allTasks.length}`);
  return allTasks;
}

async function processTaskBatch(tasks: [string, Date][]): Promise<number> {
  const results = await Promise.all(
    tasks.map(([userAddr, date]) =>
      globalLimit(() => fetchHoldingsWithRetry(userAddr, date))
    )
  );

  // filter out null results
  const validResults = results.filter(Boolean);

  if (validResults.length > 0) {
    // Insert user balances in a transaction
    await prisma.$transaction(async (prismaTransaction) => {
      // Step 1: Create user balances
      await prismaTransaction.user_balances.createMany({
        data: validResults,
      });

      // Step 2: Update points for each user
      for (const userBalance of validResults) {
        await updatePointsAggregated(userBalance);
      }
    });

    console.log(
      `Inserted ${validResults.length} records in batch and updated points_aggregated`
    );
    return validResults.length;
  }

  return 0;
}

async function fetchAndStoreHoldings() {
  const allTasks = await getAllTasks();

  if (allTasks.length === 0) {
    console.log("No tasks to process.");
    return;
  }

  let totalInserted = 0;

  for (let i = 0; i < allTasks.length; i += DB_BATCH_SIZE) {
    const taskBatch = allTasks.slice(i, i + DB_BATCH_SIZE);

    console.log(
      `Processing batch ${Math.floor(i / DB_BATCH_SIZE) + 1}/${Math.ceil(
        allTasks.length / DB_BATCH_SIZE
      )}`
    );

    const inserted = await processTaskBatch(taskBatch);
    totalInserted += inserted;

    // add small delay between batches
    if (i + DB_BATCH_SIZE < allTasks.length) {
      await sleep(500);
    }
  }

  console.log(
    `Data fetching and storage complete. Total records inserted: ${totalInserted}`
  );
}

if (require.main === module) {
  fetchAndStoreHoldings().catch((error) => {
    console.error("Fatal error during processing:", error);
    process.exit(1);
  });
}
