import assert from "assert";
import * as fs from "fs";
import { writeFileSync } from "fs";

import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
  dex_positions,
  Prisma,
  PrismaClient,
  user_balances,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import pLimit from "p-limit";
import { Contract } from "starknet";

import { DexScore, DexScoreService } from "./dex-points.service";

import { ABI as LSTAbi } from "../../../abis/LST";
import { getProvider, logger, TryCatchAsync } from "../../common/utils";
import {
  calculatePoints,
  fetchHoldingsFromApi,
  findClosestBlockInfo,
  getDate,
  getDateString,
  prisma,
  sleep,
} from "../utils";

const DB_BATCH_SIZE = 100; // no of records to insert at once
const GLOBAL_CONCURRENCY_LIMIT = 15; // total concurrent API calls allowed
const MAX_RETRIES = 5; // max number of retry attempts
const RETRY_DELAY = 30000; // 30 seconds delay between retries

const globalLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

const POINTS_MULTIPLIER = 1;

export interface IPointsSystemService {
  fetchHoldingsWithRetry(
    userAddr: string,
    date: Date
  ): Promise<{ holdings: user_balances; dex_info: DexScore }>;
  setConfig(config: { startDate: Date; endDate: Date }): void;
  updatePointsAggregated(
    userBalance: user_balances,
    prismaTransaction: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<void>;
  loadAllUserRecords(
    allUsers: { user_address: string; timestamp: number }[]
  ): Promise<void>;
  getUserRecord(addr: string): Promise<Date | null>;
  updateUserRecord(addr: string, record: Date): Promise<void>;
  getAllTasks(): Promise<[string, Date][]>;
  processTaskBatch(tasks: [string, Date][]): Promise<number>;
  doOneCallPerUser(): Promise<void>;
  loadBlocks(): Promise<void>;
  sanityBlocks(): Promise<void>;
  fetchAndStoreHoldings(): Promise<void>;
  getWeeklyPoints(): Promise<Record<string, string>>;
}

@Injectable()
export class PointsSystemService implements IPointsSystemService {
  private prisma = prisma;
  private readonly userRecords: Record<string, Date | null> = {};

  config = {
    startDate: getDate("2024-11-25"),
    endDate: getDate(),
  };

  constructor(
    @Inject(forwardRef(() => DexScoreService))
    private readonly dexPoints: DexScoreService
  ) {}

  @TryCatchAsync(MAX_RETRIES, RETRY_DELAY)
  async fetchHoldingsWithRetry(
    userAddr: string,
    date: Date
  ): Promise<{ holdings: user_balances; dex_info: DexScore }> {
    let blockInfo: { block_number: number } | null = null;
    try {
      blockInfo = await findClosestBlockInfo(date);
      if (!blockInfo || !blockInfo.block_number) {
        throw new Error(
          `No block found for user ${userAddr} on date: ${date.toISOString().split("T")[0]}`
        );
      }
      const dbObject = await fetchHoldingsFromApi(
        userAddr,
        blockInfo.block_number,
        date
      );
      const dex_info = await this.dexPoints.getDexBonusPoints(
        userAddr,
        blockInfo.block_number,
        date,
        Number(dbObject.strkHoldings.nostraDexAmount)
      );
      const holdings = {
        ...dbObject.xSTRKHoldings,
        user_address: userAddr,
        block_number: blockInfo.block_number,
        timestamp: Math.floor(date.getTime() / 1000), // convert date to timestamp
        date: date.toISOString().split("T")[0], // format date as YYYY-MM-DD
      };
      return { holdings, dex_info: dex_info };
    } catch (error) {
      console.error(error);
      logger.error(
        `Error fetching holdings for user ${userAddr} on date ${date.toISOString()}, blockInfo: ${JSON.stringify(blockInfo)}`
      );
      throw error; // rethrow to trigger retry
    }
  }

  setConfig(config: { startDate: Date; endDate: Date }) {
    this.config = config;
  }

  async updatePointsAggregated(
    userBalance: user_balances,
    prismaTransaction: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<void> {
    if (!userBalance) return;

    const userAddr = userBalance.user_address;
    const blockNumber = userBalance.block_number;
    const timestamp = userBalance.timestamp;

    const newPoints = calculatePoints(
      userBalance.total_amount,
      POINTS_MULTIPLIER
    );

    // Ensure user_allocation row exists
    await prismaTransaction.user_allocation.upsert({
      where: { user_address: userAddr },
      update: {},
      create: {
        user_address: userAddr,
        allocation: "0", // Default allocation, can be updated later
      }, // Add other required fields if needed
    });

    await prismaTransaction.points_aggregated.upsert({
      where: {
        user_address: userAddr,
      },
      update: {
        total_points: {
          increment: newPoints as bigint,
        },
        block_number: blockNumber,
        timestamp: timestamp,
      },
      create: {
        user_address: userAddr,
        total_points: newPoints as bigint,
        block_number: blockNumber,
        timestamp: timestamp,
      },
    });
  }

  async loadAllUserRecords(
    allUsers: { user_address: string; timestamp: number }[]
  ) {
    // load all user records into memory
    // selects the latest record for each user
    const latestUserRecordsByDate = await prisma.user_balances.groupBy({
      by: ["user_address"],
      _max: { date: true },
    });

    // update the in-memory cache
    allUsers.forEach((addr) => {
      const userRecord = latestUserRecordsByDate.find(
        (r) => r.user_address === addr.user_address
      );
      if (userRecord && userRecord._max && userRecord._max.date) {
        this.userRecords[addr.user_address] = getDate(userRecord._max.date);
      } else {
        this.userRecords[addr.user_address] = getDate(
          getDateString(new Date(addr.timestamp * 1000))
        ); // convert timestamp to Date
      }
    });
  }

  async getUserRecord(addr: string): Promise<Date | null> {
    const userRecord = this.userRecords[addr];

    // can be null, but n ot undefined
    // if userRecord is null, it means no record found for the user
    // if userRecord is undefined, it means the user was not accounted in loadAllUserRecords
    // which could mean we are doing something wrong
    if (userRecord || userRecord === null) {
      return userRecord;
    }

    throw new Error(`User record not found for address: ${addr}`);
  }

  async updateUserRecord(addr: string, record: Date): Promise<void> {
    this.userRecords[addr] = record;
  }

  async getAllTasks(): Promise<[string, Date][]> {
    const allUsers = await prisma.users.findMany({
      where: {
        user_address: {
          notIn: EXCLUSION_LIST, // exclude users/smart contracts in the exclusion list
        },
      },
      select: {
        user_address: true,
        timestamp: true, // first registered timestamp
      },
    });

    logger.info(`Found ${allUsers.length} users to process`);

    const allTasks: [string, Date][] = [];

    // load all user records into memory
    // eventual get user records from DB will be faster
    await this.loadAllUserRecords(allUsers);

    for (const user of allUsers) {
      const lastStoredRecord = await this.getUserRecord(user.user_address);

      // choose the start date based on the last stored record
      // if lastStoredRecord is null, it means no record found for the user
      // so we start from the startDate
      let currentDate = new Date(this.config.startDate.getTime());
      if (
        lastStoredRecord &&
        lastStoredRecord.getTime() >= currentDate.getTime()
      ) {
        currentDate = new Date(lastStoredRecord);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // create tasks for each date from currentDate to endDate
      // for each user
      while (currentDate < this.config.endDate) {
        allTasks.push([user.user_address, new Date(currentDate)]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // sort by date
    allTasks.sort((a, b) => a[1].getTime() - b[1].getTime());

    // log tasks in first 10 days as sample
    // const uniqueDates = new Set<string>();
    // allTasks.map((task) => {
    //   const dateStr = task[1].toISOString().split('T')[0];
    //   uniqueDates.add(dateStr);
    // });
    // // sort by dates
    // const sortedTasks = Array.from(uniqueDates).sort();
    // for (let i = 0; i < Math.min(10, sortedTasks.length); i++) {
    //   const count = allTasks.filter(task => task[1].toISOString().split('T')[0] === sortedSortedTasks[i]).length;
    //   logger.info(`Tasks by Date: ${sortedSortedTasks[i]}, Tasks: ${count}`);
    // }

    logger.info(`Total tasks to process: ${allTasks.length}`);
    return allTasks;
  }

  async processTaskBatch(tasks: [string, Date][]) {
    const now = new Date();
    console.log(
      `Processing batch of ${tasks.length} tasks: Now: ${now.toISOString()}`,
      now.getTime()
    );
    const minDate = tasks.reduce((min, task) => {
      return task[1] < min ? task[1] : min;
    }, getDate());
    const maxDate = tasks.reduce((max, task) => {
      return task[1] > max ? task[1] : max;
    }, getDate());
    console.log(
      `Tasks range: ${minDate.toISOString()} to ${maxDate.toISOString()}`
    );

    const results = await Promise.all(
      tasks.map(([userAddr, date]) =>
        globalLimit(() => this.fetchHoldingsWithRetry(userAddr, date))
      )
    );

    const now2 = new Date();
    console.log(
      `Fetched ${results.length} records from API: Now: ${now2.toISOString()}, diff: ${now2.getTime() - now.getTime()}ms`
    );

    const dexScoreResults: dex_positions[] = [];
    results.map((r) => {
      if (!r.dex_info) {
        return;
      }
      const dexInfo = r.dex_info;
      dexInfo.ekuboScore.map((ek) => {
        if (ek.score.toNumber() == 0) return;
        dexScoreResults.push(ek);
      });
      dexInfo.nostraScore.map((nd) => {
        if (nd.score.toNumber() == 0) return;
        dexScoreResults.push(nd);
      });
      dexInfo.strkfarmEkuboScore.map((se) => {
        if (se.score.toNumber() == 0) return;
        dexScoreResults.push(se);
      });
    });

    // Insert user balances in a transaction
    // Filter out null results (skipped users/dates)
    const validResults = results
      .map((r) => r.holdings)
      .filter(Boolean) as user_balances[];

    // duplicate dex scores
    const uniqueDexScores = new Map<string, dex_positions>();
    dexScoreResults.forEach((score) => {
      const key = `${score.user_address}-${score.pool_key}-${score.timestamp}`;
      if (!uniqueDexScores.has(key)) {
        uniqueDexScores.set(key, score);
      } else {
        console.warn(
          `Duplicate dex score found for user ${score.user_address}, pool ${score.pool_key}, timestamp ${score.timestamp}. Skipping duplicate.`
        );
      }
    });
    await prisma.$transaction(
      async (prismaTransaction) => {
        // Step 1: Create user balances
        await prismaTransaction.user_balances.createMany({
          data: validResults,
        });

        // Step 2: Create dex positions
        await prismaTransaction.dex_positions.createMany({
          data: dexScoreResults,
        });

        // Step 3: Update points for each user
        for (const userBalance of validResults) {
          await this.updatePointsAggregated(userBalance, prismaTransaction);
        }
      },
      { timeout: 300000 }
    );
    // .then(() => { // 30 seconds timeout for the transaction
    const now3 = new Date();
    console.log(
      `Inserted ${validResults.length} records in batch: Now: ${now3.toISOString()}, diff: ${now3.getTime() - now2.getTime()}ms`
    );
    return validResults.length;
    // }).catch((error) => {
    //   console.error(`Error processing batch: ${error.message}`, error);
    //   process.exit(1); // Exit the process on error
    // });
  }

  // fetches all ekubo values and caches them in memory
  // happens on API side
  // only one time run
  async doOneCallPerUser() {
    // preload ekubo info
    console.log("Preloading ekubo info for all users...");
    const allUsers = await prisma.users.findMany({
      select: {
        user_address: true,
        timestamp: true, // first registered timestamp
      },
    });
    const tasks = allUsers.map(
      (user) =>
        [user.user_address, new Date(user.timestamp * 1000 + 86400000)] as [
          string,
          Date,
        ]
    );
    for (let i = 0; i < tasks.length; i = i + 5) {
      console.log(`Preloading holdings for user: ${i}/${tasks.length}`);
      const _tasks = tasks.slice(i, i + 5);
      const proms = _tasks.map((task) =>
        globalLimit(() =>
          this.fetchHoldingsWithRetry(task[0], getDate("2024-12-01"))
        )
      );
      await Promise.all(proms);
    }
  }

  async loadBlocks() {
    const blocks = fs.readFileSync(`blocks.json`, "utf-8");
    const parsedBlocks = JSON.parse(blocks);
    if (!Array.isArray(parsedBlocks)) {
      throw new Error("Invalid blocks data format. Expected an array.");
    }
    console.log(`Loading ${parsedBlocks.length} blocks from file...`);
    for (let i = 0; i < parsedBlocks.length; i++) {
      console.log(`Loading block ${i + 1}/${parsedBlocks.length}`);
      const block = parsedBlocks[i];
      console.log(`Block: ${block.block_number}, Date: ${block.date}`);
      const res = await this.prisma.blocks.upsert({
        where: { block_number: block.block_number },
        update: {
          // timestamp: Math.round(new Date(block.date).getTime() / 1000), // convert date to timestamp
        },
        create: {
          block_number: block.block_number,
          timestamp: Math.round(getDate(block.date).getTime() / 1000), // convert date to timestamp
        },
      });
      console.log(
        `Block ${res.block_number.toString()}, ${res.timestamp.toString()} loaded successfully.`
      );
    }
    console.log("Blocks loaded successfully.");
  }

  async sanityBlocks() {
    // from start date to end date
    // check if there are blocks for each day
    const startDate = this.config.startDate;
    const endDate = this.config.endDate;
    const currentDate = new Date(startDate.getTime());
    const missingBlocks: string[] = [];
    let store: unknown[] = [];
    if (fs.existsSync(`blocks.json`)) {
      console.log(`Blocks file already exists, skipping sanity check.`);
      store = JSON.parse(fs.readFileSync(`blocks.json`, "utf-8"));
    }
    while (currentDate <= endDate) {
      console.log(
        `Checking block for date: ${currentDate.toISOString().split("T")[0]}`
      );
      const blockInfo = await findClosestBlockInfo(currentDate);
      if (!blockInfo) {
        missingBlocks.push(currentDate.toISOString().split("T")[0]);
      } else {
        const exists = store.find(
          (b: unknown) =>
            (b as { date: string }).date ===
            currentDate.toISOString().split("T")[0]
        );
        if (!exists) {
          store.push({
            date: currentDate.toISOString().split("T")[0],
            block_number: blockInfo ? blockInfo.block_number : null,
          });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // store the blocks in json
    console.log(`Storing blocks for dates`);
    store = store.sort(
      (a, b) =>
        getDate((a as { date: string }).date).getTime() -
        getDate((b as { date: string }).date).getTime()
    );
    fs.writeFileSync(`blocks.json`, JSON.stringify(store, null, 2));
    if (missingBlocks.length > 0) {
      logger.warn(`Missing blocks for dates: ${missingBlocks.join(", ")}`);
      throw new Error(`Missing blocks exist`);
    }

    logger.info("All blocks are present for the date range.");
  }

  async fetchAndStoreHoldings() {
    // sanity check for blocks
    // await this.doOneCallPerUser();
    // await this.loadBlocks();
    // await this.sanityBlocks();

    const allTasks = await this.getAllTasks();

    if (allTasks.length === 0) {
      logger.info("No tasks to process.");
      return;
    }

    const totalInserted = 0;

    for (let i = 0; i < allTasks.length; i += DB_BATCH_SIZE) {
      const taskBatch = allTasks.slice(i, i + DB_BATCH_SIZE);

      logger.info(
        `Processing batch ${Math.floor(i / DB_BATCH_SIZE) + 1}/${Math.ceil(
          allTasks.length / DB_BATCH_SIZE
        )}`
      );

      await this.processTaskBatch(taskBatch);

      // add small delay between batches
      if (i + DB_BATCH_SIZE < allTasks.length) {
        await sleep(500);
      }
    }

    const uniqueDates = new Set<string>();
    allTasks.forEach((task) => {
      const dateStr = task[1].toISOString().split("T")[0];
      uniqueDates.add(dateStr);
    });
    logger.info(`Unique dates found: ${Array.from(uniqueDates).join(", ")}`);

    for (const date of uniqueDates) {
      await this.checkSanity(date);
    }

    logger.info(`Data fetching and storage complete`);
  }

  async nostraXSTRKDebt(blockNumber: number) {
    const dToken =
      "0x0424638c9060d08b4820aabbb28347fc7234e2b7aadab58ad0f101e2412ea42d";
    const contract = new Contract({abi: LSTAbi, address: dToken, providerOrAccount: getProvider()});
    const debt: any = await contract.call("total_supply", [], {
      blockIdentifier: blockNumber,
    });
    console.log(
      `Nostra X STRK Debt at block ${blockNumber}:`,
      debt / BigInt(1e18)
    );
    return Number(debt / BigInt(1e18));
  }

  async totalSupply(blockNumber: number) {
    const lst =
      "0x028d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a";
    const contract = new Contract({abi: LSTAbi, address: lst, providerOrAccount: getProvider()});
    const supply: any = await contract.call("total_supply", [], {
      blockIdentifier: blockNumber,
    });
    console.log(`Total supply at block ${blockNumber}:`, supply / BigInt(1e18));
    return Number(supply / BigInt(1e18));
  }

  async checkSanity(date: string) {
    const blockInfo = await prisma.user_balances.findFirst({
      select: {
        block_number: true,
      },
      where: {
        date,
      },
    });
    if (!blockInfo) {
      throw new Error(`No block info found for date: ${date}`);
    }

    // await checkBalances(blockInfo.block_number);

    const debt = await this.nostraXSTRKDebt(blockInfo?.block_number ?? 0);
    const xSTRKSupply = await this.totalSupply(blockInfo?.block_number ?? 0);

    const data = await prisma.user_balances.findMany({
      where: {
        date,
        user_address: {
          notIn: xSTRK_DAPPS,
        },
      },
      select: {
        user_address: true,
        total_amount: true,
      },
    });

    // sort by total_amount descending
    const sorted = data.sort(
      (a, b) => Number(b.total_amount) - Number(a.total_amount)
    );

    const total = data.reduce(
      (acc, curr) => acc + Number(curr.total_amount),
      0
    );
    console.log(`Total amount for ${date}: ${total}`);

    const effectiveCalc = total - debt;
    console.log(`Effective calculation for ${date}: ${effectiveCalc}`);
    console.log(`Total xSTRK supply for ${date}: ${xSTRKSupply}`);

    const diff = effectiveCalc - xSTRKSupply;
    console.log(
      `Difference between effective calculation and xSTRK supply: date: ${date} - diff ${diff}`
    );

    assert(
      Math.abs(diff) < 0.015 * xSTRKSupply,
      `Data sanity check failed for date ${date}. Difference is too high: ${diff}`
    );
  }

  /**
   * Calculates and returns the weekly points for all user addresses
   * Points are calculated based on what the user has gained since the previous week
   * @returns Object mapping user addresses to their weekly points
   */
  @TryCatchAsync()
  async getWeeklyPoints(): Promise<Record<string, string>> {
    logger.info("Calculating weekly points for all users...");

    try {
      // Get the current week's start date and previous week's start date
      const now = new Date();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - 7); // Go back 7 days

      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7); // Go back another 7 days

      logger.info(
        `Calculating points delta between periods: ${previousWeekStart.toISOString()} to ${currentWeekStart.toISOString()}`
      );

      // Convert dates to timestamps for database queries
      const currentWeekTimestamp = Math.floor(
        currentWeekStart.getTime() / 1000
      );
      const previousWeekTimestamp = Math.floor(
        previousWeekStart.getTime() / 1000
      );

      // Get current points snapshot
      const currentPointsSnapshot =
        await this.prisma.points_aggregated.findMany({
          where: {
            timestamp: {
              gte: currentWeekTimestamp,
            },
            user_address: {
              notIn: EXCLUSION_LIST,
            },
          },
          select: {
            user_address: true,
            total_points: true,
          },
        });

      // Get previous points snapshot
      const previousPointsSnapshot =
        await this.prisma.points_aggregated.findMany({
          where: {
            timestamp: {
              gte: previousWeekTimestamp,
              lt: currentWeekTimestamp,
            },
            user_address: {
              notIn: EXCLUSION_LIST,
            },
          },
          select: {
            user_address: true,
            total_points: true,
          },
        });

      // Create maps for easier lookup
      const currentPointsMap: Record<string, bigint> = {};
      currentPointsSnapshot.forEach((p) => {
        currentPointsMap[p.user_address] = p.total_points;
      });

      const previousPointsMap: Record<string, bigint> = {};
      previousPointsSnapshot.forEach((p) => {
        previousPointsMap[p.user_address] = p.total_points;
      });

      // Calculate weekly delta for each user
      const weeklyPoints: Record<string, string> = {};

      // Process all addresses from both current and previous snapshots
      const allAddresses = new Set([
        ...currentPointsSnapshot.map((p) => p.user_address),
        ...previousPointsSnapshot.map((p) => p.user_address),
      ]);

      for (const address of allAddresses) {
        const currentPoints = currentPointsMap[address] || BigInt(0);
        const previousPoints = previousPointsMap[address] || BigInt(0);

        // Calculate the weekly delta (points earned this week)
        const pointsDelta = currentPoints - previousPoints;

        // Only include positive deltas
        if (pointsDelta > BigInt(0)) {
          // Convert BigInt to string for the API
          weeklyPoints[address] = pointsDelta.toString();
        } else {
          // Default to 0 for addresses with no points or negative delta
          weeklyPoints[address] = "0";
        }
      }

      // Also include any bonus points from the user_points table for this week
      const bonusPoints = await this.prisma.user_points.findMany({
        where: {
          // Filter to get only points awarded in the current week
          block_number: {
            // We would need to join with blocks to get the timestamp
            // For now, we'll assume recent blocks are within the current week
          },
          user_address: {
            notIn: EXCLUSION_LIST,
          },
        },
        select: {
          user_address: true,
          points: true,
        },
      });

      // Add bonus points to weekly totals
      for (const bonus of bonusPoints) {
        if (!weeklyPoints[bonus.user_address]) {
          weeklyPoints[bonus.user_address] = "0";
        }

        const currentTotal = BigInt(parseInt(weeklyPoints[bonus.user_address]));
        const bonusAmount = BigInt(Math.round(Number(bonus.points) * 100)); // Convert to BigInt with 2 decimal precision

        weeklyPoints[bonus.user_address] = (
          currentTotal + bonusAmount
        ).toString();
      }

      // Format all point values to have 2 decimal places
      for (const address in weeklyPoints) {
        const pointsValue = BigInt(weeklyPoints[address]);
        // Convert to string with 2 decimal places
        weeklyPoints[address] = (Number(pointsValue) / 100).toFixed(2);
      }

      logger.info(
        `Weekly points calculated for ${Object.keys(weeklyPoints).length} addresses`
      );
      return weeklyPoints;
    } catch (error) {
      logger.error(
        "Error calculating weekly points:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  /**
   * Calculate base points from user holdings
   */
  private calculateBasePoints(holdings: any[]): number {
    return holdings.reduce((total, holding) => {
      // Calculate points based on token value, amount, etc.
      const holdingValue = holding.amount * (holding.price || 0);

      // Example formula: 1 point per 10 units of token value
      const holdingPoints = holdingValue / 10;

      return total + holdingPoints;
    }, 0);
  }
}

export const xSTRK_DAPPS = [
  "0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef", // Singleton
  "0xd8d6dfec4d33bfb6895de9f3852143a17c6f92fd2a21da3d6924d34870160", // Singleton V2
  "0x1b8d8e31f9dd1bde7dc878dd871225504837c78c40ff01cbf03a255e2154bf0", // nxSTRK-c
  "0x6878fd475d5cea090934d690ecbe4ad78503124e4f80380a2e45eb417aafb9c", // nxSTRK
  "0x59a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff", // nostra interest rate model
  "0x5dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b", // Ekubo Core
  "0x205fd8586f6be6c16f4aa65cc1034ecff96d96481878e55f629cd0cb83e05f", // Nostra xSTRK/STRK DEX pool
  "0x7023a5cadc8a5db80e4f0fde6b330cbd3c17bbbf9cb145cbabd7bd5e6fb7b0b", // STRKFarm xSTRK Sensei
  "0x1f083b98674bc21effee29ef443a00c7b9a500fd92cf30341a3da12c73f2324", // STRKFarm xSTRK Ekubo
  "0x4a3e7dffd8e74a706be9abe6474e07fbbcf41e1be71387514c4977d54dbc428", // Opus
];

// contracts excluded from points system
export const EXCLUSION_LIST = [
  ...xSTRK_DAPPS,
  "0x301c5ba2c76af76c28e9f4d55680d8507267b9d324129a71d6cdc54a3318298", // admin wallet
];
