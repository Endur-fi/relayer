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

const DB_BATCH_SIZE = 2000; // no of records to insert at once
const GLOBAL_CONCURRENCY_LIMIT = 40; // total concurrent API calls allowed
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
      return dbObject;
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

    logger.info(`Total tasks to process: ${allTasks.length}`);
    return allTasks;
  }

  async processTaskBatch(tasks: [string, Date][]): Promise<number> {
    console.log(`Processing batch of ${tasks.length} tasks: Now: ${new Date().toISOString()}`);
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

    console.log(`Fetched ${results.length} records from API: Now: ${new Date().toISOString()}`);

    // Insert user balances in a transaction
    await prisma.$transaction(async (prismaTransaction) => {
      // Step 1: Create user balances
      await prismaTransaction.user_balances.createMany({
        data: results,
      });

      // Step 2: Update points for each user
      for (const userBalance of results) {
        await this.updatePointsAggregated(userBalance, prismaTransaction);
      }
    });

    logger.info(`Inserted ${results.length} records in batch and updated points_aggregated: Now: ${new Date().toISOString()}`);
    return results.length;
  }

  async fetchAndStoreHoldings() {
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
