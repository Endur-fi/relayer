import axios from "axios";
import pLimit from "p-limit";
import { PrismaClient, users } from "@prisma/client";

const prisma = new PrismaClient();
const API_BASE_URL = "http://localhost:3000/api/block-holdings";
const DB_BATCH_SIZE = 100; // no of records to insert at once
const GLOBAL_CONCURRENCY_LIMIT = 5; // total concurrent API calls allowed
const MAX_RETRIES = 3; // max number of retry attempts
const RETRY_DELAY = 5000; // 5 seconds delay between retries

const globalLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHoldingsWithRetry(
  userAddr: string,
  date: Date
): Promise<schema.XSTRK_HOLDING_TYPE | null> {
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
      if (!blockInfo) {
        throw new Error(
          `No block found for user ${userAddr} on date: ${date.toISOString().split("T")[0]}`
        );
        return null;
      }
          

      const url = `${API_BASE_URL}/${userAddr}/${blockInfo.block_number}`;

      const response = await axios.get(url);
      const data = response.data;

      if (!data.blocks || !data.blocks[0]) {
        console.warn(
          `Invalid data format for user ${userAddr} on date: ${date.toISOString().split("T")[0]}`
        );
        return null;
      }

      let totalAmount = 0;
      const dapps = ['vesu', 'ekubo', 'nostraLending', 'nostraDex', 'wallet', 'strkfarm'];
      
      const dbObject = {
        userAddress: userAddr,
        blockNumber: Number(data.blocks[0].block),
        vesuAmount: '0',
        ekuboAmount: '0',
        nostraLendingAmount: '0',
        nostraDexAmount: '0',
        walletAmount: '0',
        strkfarmAmount: '0',
        totalAmount: '0',
        date: date.toISOString().split("T")[0],
        timestamp: timestamp,
      };

      for (let dapp of dapps) {
        if (!data[dapp] || !data[dapp][0]) {
          throw new Error(
            `Invalid data format for dapp ${dapp} for user ${userAddr} on date: ${date.toISOString().split("T")[0]}`
          );
        }

        const xSTRKAmount = Number(Number(data[dapp][0].xSTRKAmount.bigNumber * 100) / 10 ** data[dapp][0].xSTRKAmount.decimals) / 100;
        totalAmount += xSTRKAmount;
        dbObject[`${dapp}Amount`] = xSTRKAmount.toString();
      }

      dbObject.totalAmount = totalAmount.toString();
      return dbObject;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error(
          `Failed after ${MAX_RETRIES} attempts for user ${userAddr} on date ${date.toISOString().split("T")[0]}: ${error.message}`
        );
        return null;
      }
      console.warn(
        `Attempt ${retries}/${MAX_RETRIES} failed for user ${userAddr} on date ${date.toISOString().split("T")[0]}: ${error.message}. Retrying in ${RETRY_DELAY / 1000}s...`
      );
      await sleep(RETRY_DELAY);
    }
  }

  return null;
}

async function getAllTasks(): Promise<[string, Date][]> {
  const allUsers = await prisma.users.findMany({
    select: {
      user_address: true,
    }
  });

  console.log(`Found ${allUsers.length} users to process`);

  const startDate = new Date("2024-11-24");
  const endDate = new Date();

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
      }
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
  const validResults: any = results.filter(Boolean);

  if (validResults.length > 0) {
    await prisma.user_balances.createMany({
      data: validResults,
    });
    console.log(`Inserted ${validResults.length} records in batch`);
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
      `Processing batch ${Math.floor(i / DB_BATCH_SIZE) + 1}/${Math.ceil(allTasks.length / DB_BATCH_SIZE)}`
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
