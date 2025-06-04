import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, user_balances } from '@prisma/my-client';
import { DefaultArgs } from '@prisma/my-client/runtime/library';
import pLimit from 'p-limit';

import { logger, TryCatchAsync } from '../../common/utils';
import {
  calculatePoints,
  fetchHoldingsFromApi,
  findClosestBlockInfo,
  prisma,
  sleep,
} from '../utils';

const DB_BATCH_SIZE = 500; // no of records to insert at once
const GLOBAL_CONCURRENCY_LIMIT = 15; // total concurrent API calls allowed
const MAX_RETRIES = 5; // max number of retry attempts
const RETRY_DELAY = 30000; // 30 seconds delay between retries

const globalLimit = pLimit(GLOBAL_CONCURRENCY_LIMIT);

const POINTS_MULTIPLIER = 1;

@Injectable()
export class PointsSystemService {
  private prisma = prisma;
  private readonly userRecords: Record<string, Date | null> = {};

  config = {
    startDate: new Date('2024-11-25'),
    endDate: new Date(new Date().setHours(0, 0, 0, 0)),
  };

  @TryCatchAsync(MAX_RETRIES, RETRY_DELAY)
  async fetchHoldingsWithRetry(userAddr: string, date: Date): Promise<user_balances> {
    let blockInfo: { block_number: number } | null = null;
    try {
      blockInfo = await findClosestBlockInfo(date);
      if (!blockInfo || !blockInfo.block_number) {
        throw new Error(
          `No block found for user ${userAddr} on date: ${date.toISOString().split('T')[0]}`,
        );
      }
      const dbObject = await fetchHoldingsFromApi(userAddr, blockInfo.block_number, date);
      // const dbObject = await getAllHoldings(userAddr, blockInfo.block_number);
      return {
        ...dbObject,
        user_address: userAddr,
        block_number: blockInfo.block_number,
        timestamp: Math.floor(date.getTime() / 1000), // convert date to timestamp
        date: date.toISOString().split('T')[0], // format date as YYYY-MM-DD
      };
    } catch (error) {
      logger.error(
        `Error fetching holdings for user ${userAddr} on date ${date.toISOString()}, blockInfo: ${JSON.stringify(blockInfo)}`,
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
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<void> {
    if (!userBalance) return;

    const userAddr = userBalance.user_address;
    const blockNumber = userBalance.block_number;
    const timestamp = userBalance.timestamp;

    const newPoints = calculatePoints(userBalance.total_amount, POINTS_MULTIPLIER);

    // Ensure user_allocation row exists
    await prismaTransaction.user_allocation.upsert({
      where: { user_address: userAddr },
      update: {},
      create: { 
        user_address: userAddr,
        allocation: '0', // Default allocation, can be updated later
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

  async loadAllUserRecords(allUsers: { user_address: string, timestamp: number }[]) {
    // load all user records into memory
    // selects the latest record for each user
    const latestUserRecordsByDate = await prisma.user_balances.groupBy({
      by: ['user_address'],
      _max: { date: true },
    });

    // update the in-memory cache
    allUsers.forEach((addr) => {
      const userRecord = latestUserRecordsByDate.find((r) => r.user_address === addr.user_address);
      if (userRecord && userRecord._max && userRecord._max.date) {
        this.userRecords[addr.user_address] = new Date(userRecord._max.date);
      } else {
        this.userRecords[addr.user_address] = new Date(addr.timestamp * 1000); // convert timestamp to Date
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
        }
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
      if (lastStoredRecord && lastStoredRecord.getTime() >= currentDate.getTime()) {
        currentDate = new Date(lastStoredRecord);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // create tasks for each date from currentDate to endDate
      // for each user
      while (currentDate <= this.config.endDate) {
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
    //   const count = allTasks.filter(task => task[1].toISOString().split('T')[0] === sortedTasks[i]).length;
    //   logger.info(`Tasks by Date: ${sortedTasks[i]}, Tasks: ${count}`);
    // }

    logger.info(`Total tasks to process: ${allTasks.length}`);
    return allTasks;
  }

  async processTaskBatch(tasks: [string, Date][]): Promise<number> {
    const now = new Date();
    console.log(`Processing batch of ${tasks.length} tasks: Now: ${now.toISOString()}`);
    const minDate = tasks.reduce((min, task) => {
      return task[1] < min ? task[1] : min;
    }, new Date());
    const maxDate = tasks.reduce((max, task) => {
      return task[1] > max ? task[1] : max;
    }, new Date(0));
    console.log(`Tasks range: ${minDate.toISOString()} to ${maxDate.toISOString()}`);

    const results = await Promise.all(
      tasks.map(([userAddr, date]) =>
        globalLimit(() => this.fetchHoldingsWithRetry(userAddr, date)),
      ),
    );

    const now2 = new Date();
    console.log(`Fetched ${results.length} records from API: Now: ${now2.toISOString()}, diff: ${now2.getTime() - now.getTime()}ms`);

    // Insert user balances in a transaction
    // Filter out null results (skipped users/dates)
    const validResults = results.filter(Boolean) as user_balances[];

    await prisma.$transaction(async (prismaTransaction) => {
      // Step 1: Create user balances
      await prismaTransaction.user_balances.createMany({
        data: validResults,
      });

      // Step 2: Update points for each user
      for (const userBalance of validResults) {
        await this.updatePointsAggregated(userBalance, prismaTransaction);
      }
    }, { timeout: 300000 }); // 30 seconds timeout for the transaction

    const now3 = new Date();
    console.log(`Inserted ${validResults.length} records in batch: Now: ${now3.toISOString()}, diff: ${now3.getTime() - now2.getTime()}ms`);
    return validResults.length;
  }

  // fetches all ekubo values and caches them in memory 
  // happens on API side 
  // only one time run
  async doOneCallPerUser() {
    // preload ekubo info
    console.log('Preloading ekubo info for all users...');
    const allUsers = await prisma.users.findMany({
      select: {
        user_address: true,
        timestamp: true, // first registered timestamp
      },
    });
    const tasks = allUsers.map((user) => [user.user_address, new Date(user.timestamp * 1000 + 86400000)] as [string, Date]);
    for (let i = 0; i < tasks.length; i = i + 5) {
      console.log(`Preloading holdings for user: ${i}/${tasks.length}`);
      const _tasks = tasks.slice(i, i + 5);
      const proms  = _tasks.map((task) => globalLimit(() => this.fetchHoldingsWithRetry(task[0], new Date("2024-12-01"))));
      await Promise.all(proms);
    }
  }

  async loadBlocks() {
    const fs = require('fs');
    const blocks = fs.readFileSync(`blocks.json`, 'utf-8');
    const parsedBlocks = JSON.parse(blocks);
    if (!Array.isArray(parsedBlocks)) {
      throw new Error('Invalid blocks data format. Expected an array.');
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
          timestamp: Math.round(new Date(block.date).getTime() / 1000), // convert date to timestamp
        },
      });
      console.log(`Block ${res.block_number.toString()}, ${res.timestamp.toString()} loaded successfully.`);
    }
    console.log('Blocks loaded successfully.');
  }

  async sanityBlocks() {
    // from start date to end date
    // check if there are blocks for each day
    const startDate = this.config.startDate;
    const endDate = this.config.endDate;
    const currentDate = new Date(startDate);
    const missingBlocks: string[] = [];
    let store: any[] = [];
    const fs = require('fs');
    if (fs.existsSync(`blocks.json`)) {
      console.log(`Blocks file already exists, skipping sanity check.`);
      store = JSON.parse(fs.readFileSync(`blocks.json`, 'utf-8'));
    }
    while (currentDate <= endDate) {
      console.log(`Checking block for date: ${currentDate.toISOString().split('T')[0]}`);
      const blockInfo = await findClosestBlockInfo(currentDate);
      if (!blockInfo) {
        missingBlocks.push(currentDate.toISOString().split('T')[0]);
      } else {
        const exists = store.find((b: any) => b.date === currentDate.toISOString().split('T')[0]);
        if (!exists) {
          store.push({
            date: currentDate.toISOString().split('T')[0],
            block_number: blockInfo ? blockInfo.block_number : null,
          });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // store the blocks in json
    console.log(`Storing blocks for dates`);
    store = store.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    fs.writeFileSync(`blocks.json`, JSON.stringify(store, null, 2));
    if (missingBlocks.length > 0) {
      logger.warn(`Missing blocks for dates: ${missingBlocks.join(', ')}`);
      throw new Error(`Missing blocks exist`);
    }
    
    logger.info('All blocks are present for the date range.');
  }

  async fetchAndStoreHoldings() {
    // sanity check for blocks
    // await this.loadBlocks();
    // await this.sanityBlocks();

    const allTasks = await this.getAllTasks();

    if (allTasks.length === 0) {
      logger.info('No tasks to process.');
      return;
    }

    let totalInserted = 0;

    for (let i = 0; i < allTasks.length; i += DB_BATCH_SIZE) {
      const taskBatch = allTasks.slice(i, i + DB_BATCH_SIZE);

      logger.info(
        `Processing batch ${Math.floor(i / DB_BATCH_SIZE) + 1}/${Math.ceil(
          allTasks.length / DB_BATCH_SIZE,
        )}`,
      );

      const inserted = await this.processTaskBatch(taskBatch);
      totalInserted += inserted;

      // add small delay between batches
      if (i + DB_BATCH_SIZE < allTasks.length) {
        await sleep(500);
      }
    }

    logger.info(`Data fetching and storage complete. Total records inserted: ${totalInserted}`);
  }
}

export const xSTRK_DAPPS = [
  '0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef', // Singleton
  '0xd8d6dfec4d33bfb6895de9f3852143a17c6f92fd2a21da3d6924d34870160', // Singleton V2
  '0x1b8d8e31f9dd1bde7dc878dd871225504837c78c40ff01cbf03a255e2154bf0', // nxSTRK-c
  '0x6878fd475d5cea090934d690ecbe4ad78503124e4f80380a2e45eb417aafb9c', // nxSTRK
  '0x59a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff', // nostra interest rate model
  '0x5dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b', // Ekubo Core
  '0x205fd8586f6be6c16f4aa65cc1034ecff96d96481878e55f629cd0cb83e05f', // Nostra xSTRK/STRK DEX pool
  '0x7023a5cadc8a5db80e4f0fde6b330cbd3c17bbbf9cb145cbabd7bd5e6fb7b0b', // STRKFarm xSTRK Sensei
  ''
]
// contracts excluded from points system
export const EXCLUSION_LIST = [
  ...xSTRK_DAPPS,
  '0x301c5ba2c76af76c28e9f4d55680d8507267b9d324129a71d6cdc54a3318298', // admin wallet
]