import fs from "fs";

import { logger } from "@strkfarm/sdk";
import { all } from "axios";
import pLimit from "p-limit";

import { fetchHoldingsFromApi, prisma } from "../utils";

const GLOBAL_CONCURRENCY_LIMIT = 60; // total concurrent API calls allowed
const globalLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

const userInfoCache: Record<string, { block_number: number }> = {};
const blockInfoCache: Record<string, { block_number: number }> = {};
async function fetchHoldingsWithRetry(userAddr: string, date: Date) {
  try {
    if (!userInfoCache[userAddr]) {
      throw new Error(`User ${userAddr} not found in userInfoCache`);
    }
    const userInfo = userInfoCache[userAddr];

    if (!blockInfoCache[date.toISOString().split("T")[0]]) {
      throw new Error(
        `Block info for user ${userAddr} not found in blockInfoCache`
      );
    }

    const blockInfo = blockInfoCache[date.toISOString().split("T")[0]];

    if (blockInfo.block_number < userInfo.block_number) {
      return null;
    }

    const dbObject = await fetchHoldingsFromApi(
      userAddr,
      blockInfo.block_number,
      date
    );
    return {
      user_address: userAddr,
      opusAmount: dbObject.xSTRKHoldings.opusAmount,
      block_number: blockInfo.block_number,
    };
  } catch (error) {
    logger.error(
      `Error fetching holdings for user ${userAddr} on date ${date.toISOString()}`
    );
    throw error; // rethrow to trigger retry
  }
}

const cache: any = {};
async function saveHoldingsBatch(allHoldings: any[]) {
  let records = 0;
  await prisma.$transaction(
    async (tx) => {
      for (const holdings of allHoldings) {
        if (holdings && holdings.opusAmount && holdings.opusAmount !== "0") {
          const existing = await tx.user_balances.findFirst({
            where: {
              user_address: holdings.user_address,
              block_number: holdings.block_number,
            },
          });
          if (existing && existing.opusAmount === holdings.opusAmount) {
            console.log(
              `No update needed for user: ${holdings.user_address} with opusAmount: ${holdings.opusAmount}`
            );
            continue;
          }

          await tx.user_balances.updateMany({
            where: {
              user_address: holdings.user_address,
              block_number: holdings.block_number,
            },
            data: {
              opusAmount: holdings.opusAmount,
            },
          });
          await tx.points_aggregated.update({
            where: {
              user_address: holdings.user_address,
            },
            data: {
              total_points: {
                increment: Math.round(Number(holdings.opusAmount)), // Assuming opusAmount is in xSTRK
              },
            },
          });
          records++;
          console.log(
            `Updated user: ${holdings.user_address} with opusAmount: ${holdings.opusAmount}`,
            records
          );
        }
      }
    },
    { timeout: 300000 }
  ); // 10 seconds timeout for the transaction
  return records;
}

async function handleOpusPoints() {
  const startDate = new Date("2024-12-01");
  const endDate = new Date("2025-05-25");

  const users = JSON.parse(fs.readFileSync("opus.json", "utf8"));
  console.log(`Found ${users.length} users in opus.json`);

  const tasks: [string, Date][] = [];
  for (const user of users) {
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      tasks.push([user, new Date(date)]);
    }
  }
  console.log(`Created ${tasks.length} tasks for users.`);

  // load userinfo
  for (const user of users) {
    const userInfo = await prisma.users.findFirst({
      where: {
        user_address: user,
      },
      select: {
        user_address: true,
        block_number: true,
      },
    });
    if (!userInfo) {
      throw new Error(`User ${user} not found in database`);
    }
    userInfoCache[user] = {
      block_number: userInfo.block_number,
    };
  }

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateKey = date.toISOString().split("T")[0];
    const blockInfo = await prisma.user_balances.findFirst({
      where: {
        date: date.toISOString().split("T")[0], // format date to YYYY-MM-DD
      },
      select: {
        block_number: true,
        user_address: true,
      },
    });
    if (!blockInfo) {
      throw new Error(`No block info found for user on date ${dateKey}`);
    }
    blockInfoCache[dateKey] = {
      block_number: blockInfo.block_number,
    };
  }

  const proms: unknown[] = [];
  let count = 0;
  const records = 0;

  async function processTask(_user: string, _date: Date) {
    try {
      const holdings = await fetchHoldingsWithRetry(_user, _date);
      if (!holdings) {
        count++;
        return;
      }
      // console.log(`Fetched holdings for user: ${_user} on date: ${_date.toISOString()}: ${JSON.stringify(holdings)}`);
      count++;
      return holdings;
    } catch (error) {
      count++;
      console.error(
        `Failed to fetch holdings for user: ${_user} on date: ${_date.toISOString()}:`,
        error
      );
    }
  }

  setInterval(() => {
    console.log(
      `Processed ${count} tasks so far., records updated: ${records}`
    );
  }, 10000); // log every 10 seconds

  const data: unknown[] = [];
  for (const [user, date] of tasks) {
    proms.push(globalLimit(() => processTask(user, date)));
    // if (proms.length > 60) {
    //   const holdings = (await Promise.all(proms)).filter(h => h);
    //   if (holdings.length > 0) {
    //     const newRecords = await saveHoldingsBatch(holdings, false);
    //     records += newRecords;
    //     if (newRecords > 0) {
    //       console.log(`Saved batch of records updated: ${newRecords}`);
    //     }
    //   }
    //   proms = [];
    // }
  }

  const results = await Promise.all(proms);
  const holdings = results.filter(
    (h) =>
      h &&
      (h as { opusAmount: string }).opusAmount &&
      (h as { opusAmount: string }).opusAmount !== "0"
  );
  data.push(...holdings);
  fs.writeFileSync("holdings.json", JSON.stringify(data, null, 2));
  // if (proms.length > 0) {
  //   const holdings = (await Promise.all(proms)).filter(h => h);
  //   if (holdings.length > 0) {
  //     const newRecords = await saveHoldingsBatch(holdings, true);
  //     records += newRecords;
  //     if (newRecords > 0) {
  //       console.log(`Final batch saved, records updated: ${newRecords}`);
  //     }
  //   }
  // }
  console.log(`Processed ${count} tasks.`);

  console.log(`Total records updated: ${records}`);
}

async function storeOpusHoldings() {
  const data = JSON.parse(fs.readFileSync("holdings.json", "utf8"));
  console.log(`Found ${data.length} holdings in holdings.json`);

  for (let i = 0; i < data.length; i += 50) {
    const batch = data.slice(i, i + 50);
    const records = await saveHoldingsBatch(batch);
    console.log(
      `Saved batch ${Math.ceil(i / 50) + 1} of ${Math.ceil(data.length / 50)} with ${records} records updated.`
    );
  }
}

if (require.main === module) {
  // handleOpusPoints()
  //   .then(() => {
  //     console.log('All tasks completed successfully.');
  //   })
  //   .catch((error) => {
  //     console.error('An error occurred during processing:', error);
  //   });
  storeOpusHoldings()
    .then(() => {
      console.log("All holdings stored successfully.");
    })
    .catch((error) => {
      console.error("An error occurred during storing holdings:", error);
    });
}
