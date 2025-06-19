import { Injectable } from '@nestjs/common';
import { UserPointsType } from '@prisma/client';

import { logger } from '../../common/utils';
import { bigIntToDecimal, calculatePoints, prisma } from '../utils';

// ! Update these constants as needed
export const EARLY_USER_BONUS_PERCENTAGE = 20; // 20% bonus
const EARLY_USER_CUTOFF_DATE = new Date('2025-05-25T23:59:59.999Z'); // May 26th, 2025 eod

const SIX_MONTHS_DAYS = 180; // 6 months
const SIX_MONTH_BONUS_MULTIPLIER = 0.2; // 20% bonus

const BATCH_SIZE = 100;
const POINTS_MULTIPLIER = 1;

@Injectable()
export class BonusService {
  private prisma = prisma;

  // calculate and award early user bonus points
  async calculateAndAwardEarlyUserBonus(): Promise<void> {
    logger.info('Starting Early User Early calculation...');
    logger.info(`Cutoff date: ${EARLY_USER_CUTOFF_DATE.toISOString()}`);
    logger.info(`Early percentage: ${EARLY_USER_BONUS_PERCENTAGE}%`);

    try {
      // check if any early user bonuses have already been awarded
      const existingBonuses = await this.prisma.user_points.count({
        where: {
          type: UserPointsType.Early,
        },
      });

      if (existingBonuses > 0) {
        logger.warn(
          `Found ${existingBonuses} existing bonus records. Early user bonus may have already been processed.`,
        );
        const proceed = await this.confirmProceed();
        if (!proceed) {
          logger.info('Early user bonus calculation cancelled by user.');
          return;
        }
      }

      // all users who have points in the system
      const usersWithPoints = await this.getUsersWithPointsBeforeCutoff();

      if (usersWithPoints.length === 0) {
        logger.info('No users found with points before the cutoff date.');
        return;
      }

      logger.info(`Found ${usersWithPoints.length} users eligible for early user bonus`);

      // process users in batches
      let totalProcessed = 0;
      let totalBonusAwarded = BigInt(0);

      for (let i = 0; i < usersWithPoints.length; i += BATCH_SIZE) {
        const batch = usersWithPoints.slice(i, i + BATCH_SIZE);
        const batchResult = await this.processEarlyUserBatch(batch, EARLY_USER_BONUS_PERCENTAGE / 100);

        totalProcessed += batchResult.processed;
        totalBonusAwarded += batchResult.bonusAwarded;

        logger.info(
          `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(usersWithPoints.length / BATCH_SIZE)}`,
        );
        logger.info(
          `Batch: ${batchResult.processed} users, ${batchResult.bonusAwarded} bonus points awarded`,
        );
      }

      logger.info('Early User Early calculation completed successfully!');
      logger.info(`Total users processed: ${totalProcessed}`);
      logger.info(`Total bonus points awarded: ${totalBonusAwarded}`);
    } catch (error) {
      logger.error('Error during Early User Early calculation:', error);
      throw error;
    }
  }

  // calculate and award six month bonus points based on minimum holdings
  async calculateAndAwardSixMonthBonus(): Promise<void> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - SIX_MONTHS_DAYS);

    logger.info('Starting Six Month Bonus calculation...');
    logger.info(
      `Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    );
    logger.info(
      `Bonus multiplier: ${SIX_MONTH_BONUS_MULTIPLIER} (${SIX_MONTH_BONUS_MULTIPLIER * 100}%)`,
    );

    try {
      // get all users who have balances in the last 6 months
      const usersWithMinimums = await this.getUsersWithMinimumHoldings(startDate, endDate);

      if (usersWithMinimums.length === 0) {
        logger.info('No users found with holdings in the last 6 months.');
        return;
      }

      logger.info(`Found ${usersWithMinimums.length} users eligible for six month bonus`);

      let totalProcessed = 0;
      let totalBonusAwarded = BigInt(0);

      for (let i = 0; i < usersWithMinimums.length; i += BATCH_SIZE) {
        const batch = usersWithMinimums.slice(i, i + BATCH_SIZE);
        const batchResult = await this.processSixMonthBatch(batch, endDate);

        totalProcessed += batchResult.processed;
        totalBonusAwarded += batchResult.bonusAwarded;

        logger.info(
          `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(usersWithMinimums.length / BATCH_SIZE)}`,
        );
        logger.info(
          `Batch: ${batchResult.processed} users, ${batchResult.bonusAwarded} bonus points awarded`,
        );
      }

      logger.info('Six Month Bonus calculation completed successfully!');
      logger.info(`Total users processed: ${totalProcessed}`);
      logger.info(`Total bonus points awarded: ${totalBonusAwarded}`);
    } catch (error) {
      logger.error('Error during Six Month Bonus calculation:', error);
      throw error;
    }
  }

  private async getUsersWithPointsBeforeCutoff(): Promise<
    Array<{
      user_address: string;
      pointsBeforeCutoff: bigint;
      latestBlockBeforeCutoff: number;
    }>
  > {

    // get the latest block number before the cutoff date
    const cutoffBlock = await this.prisma.blocks.findFirst({
      where: {
        timestamp: {
          lte: Math.floor(EARLY_USER_CUTOFF_DATE.getTime() / 1000) + 86400, // add 24 hours buffer
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    const lowerCutoff = await this.prisma.blocks.findFirst({
      where: {
        timestamp: {
          gte: Math.floor(EARLY_USER_CUTOFF_DATE.getTime() / 1000) - 86400, // add 24 hours buffer
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    if (!cutoffBlock || !lowerCutoff) {
      logger.warn('No blocks found for cutoff date');
      return [];
    }

    logger.info(
      `Using block ${cutoffBlock.block_number} as cutoff (timestamp: ${new Date(cutoffBlock.timestamp * 1000).toISOString()})`,
    );
    logger.info(
      `Lower cutoff block ${lowerCutoff?.block_number} (timestamp: ${new Date(lowerCutoff?.timestamp * 1000).toISOString()})`,
    );
    
    // query user_balances to find all users who had balances before the cutoff
    // and calculate their total points earned up to that date
    const usersWithBalances = await this.prisma.points_aggregated.findMany({
      select: {
        user_address: true,
        total_points: true,
        block_number: true,
      },
    });

    const result: Array<{
      user_address: string;
      pointsBeforeCutoff: bigint;
      latestBlockBeforeCutoff: number;
    }> = [];

    // for each user, get their latest balance before cutoff and calculate points
    for (const userGroup of usersWithBalances) {
      if (!userGroup.block_number) continue;

      // it needs to be within the cutoff block range bcz that ensures latest points have been aggregated
      if (userGroup.block_number > cutoffBlock.block_number || userGroup.block_number < lowerCutoff.block_number) {
        console.error(`User ${userGroup.user_address} has points outside the cutoff range, block: ${userGroup.block_number}`);
        throw new Error(`Points aggregation moved ahead, computing now will give incorrect results`);
      }
      // calculate points for this user's balance
      // const points = calculatePoints(userGroup.total_points.toString(), pointsMultiplier) as bigint;

      if (userGroup.total_points > 0) {
        result.push({
          user_address: userGroup.user_address,
          pointsBeforeCutoff: BigInt(userGroup.total_points),
          latestBlockBeforeCutoff: cutoffBlock.block_number,
        });
      }
    }

    return result.sort((a, b) => a.user_address.localeCompare(b.user_address));
  }

  private async getUsersWithMinimumHoldings(
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      user_address: string;
      minimumAmount: string;
      latestBlockNumber: number;
    }>
  > {
    // convert dates to timestamp for comparison
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // get all users who have balance records in the specified period
    const usersInPeriod = await this.prisma.user_balances.groupBy({
      by: ['user_address'],
      where: {
        timestamp: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      _max: {
        block_number: true,
      },
    });

    const result: Array<{
      user_address: string;
      minimumAmount: string;
      latestBlockNumber: number;
    }> = [];

    // for each user, find their minimum total_amount in the period
    for (const userGroup of usersInPeriod) {
      if (!userGroup._max.block_number) continue;

      // get all balance records for this user in the period
      const userBalances = await this.prisma.user_balances.findMany({
        where: {
          user_address: userGroup.user_address,
          timestamp: {
            gte: startTimestamp,
            lte: endTimestamp,
          },
        },
        select: {
          total_amount: true,
          block_number: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      if (userBalances.length === 0) continue;

      // find the minimum total_amount for this user
      const minimumAmount = userBalances.reduce((min, balance) => {
        const current = BigInt(balance.total_amount);
        const minimum = BigInt(min);
        return current < minimum ? balance.total_amount : min;
      }, userBalances[0].total_amount);

      // only include users with non-zero minimum amounts
      if (BigInt(minimumAmount) > 0) {
        result.push({
          user_address: userGroup.user_address,
          minimumAmount,
          latestBlockNumber: userGroup._max.block_number,
        });
      }
    }

    return result.sort((a, b) => a.user_address.localeCompare(b.user_address));
  }

  private async processEarlyUserBatch(
    users: Array<{
      user_address: string;
      pointsBeforeCutoff: bigint;
      latestBlockBeforeCutoff: number;
    }>,
    pointsMultiplier: number,
  ): Promise<{ processed: number; bonusAwarded: bigint }> {
    return await this.prisma.$transaction(async (tx) => {
      let batchBonusAwarded = BigInt(0);

      for (const user of users) {
        // calculate bonus points (20% of points earned before cutoff)
        const bonusPoints =
          (user.pointsBeforeCutoff * BigInt(pointsMultiplier * 10000) / BigInt(10000));

        if (bonusPoints > 0) {
          // check if bonus already exists for this user
          const existingBonus = await tx.user_points.findUnique({
            where: {
              block_number_user_address_type: {
                block_number: user.latestBlockBeforeCutoff,
                user_address: user.user_address,
                type: UserPointsType.Early,
              },
            },
          });

          if (existingBonus) {
            console.warn(`Early user bonus already exists for user ${user.user_address} at block ${user.latestBlockBeforeCutoff}`);
            continue; // skip if bonus already exists
          }

          // create bonus points record
          await tx.user_points.create({
            data: {
              block_number: user.latestBlockBeforeCutoff,
              user_address: user.user_address,
              points: bigIntToDecimal(bonusPoints),
              cummulative_points: bigIntToDecimal(bonusPoints),
              type: UserPointsType.Early,
            },
          });

          // update the aggregated points
          await tx.points_aggregated.update({
            where: {
              user_address: user.user_address,
            },
            data: {
              total_points: {
                increment: bonusPoints,
              },
            },
          });

          batchBonusAwarded += bonusPoints;
        }
      }

      return {
        processed: users.length,
        bonusAwarded: batchBonusAwarded,
      };
    }, { timeout: 300000 }); // 5 minutes timeout for the transaction
  }

  private async processSixMonthBatch(
    users: Array<{
      user_address: string;
      minimumAmount: string;
      latestBlockNumber: number;
    }>,
    endDate: Date,
  ): Promise<{ processed: number; bonusAwarded: bigint }> {
    return await this.prisma.$transaction(async (tx) => {
      let batchBonusAwarded = BigInt(0);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      for (const user of users) {
        // calculate bonus points: MINIMUM * 180 * MULTIPLIER
        const minimumAmountBigInt = BigInt(user.minimumAmount);
        const bonusPoints =
          (minimumAmountBigInt *
            BigInt(SIX_MONTHS_DAYS) *
            BigInt(Math.floor(SIX_MONTH_BONUS_MULTIPLIER * 100))) /
          BigInt(100);

        if (bonusPoints > 0) {
          // check if six month bonus already exists for this user and period
          // we use a unique identifier based on the user and the end date
          const bonusIdentifier = `6m_${endDate.toISOString().split('T')[0]}`;

          // check existing bonus records for this user
          const existingBonuses = await tx.user_points.findMany({
            where: {
              user_address: user.user_address,
              type: UserPointsType.Bonus,
              block_number: user.latestBlockNumber,
            },
          });

          // check if we already have a six month bonus for this period
          // since we can't store custom identifiers, we'll check by comparing the bonus amount
          // and ensuring it matches our six month bonus calculation
          const existingSixMonthBonus = existingBonuses.find((bonus) => {
            const existingPoints = BigInt(bonus.points.toString());
            return existingPoints === bonusPoints;
          });

          if (!existingSixMonthBonus) {
            // create bonus points record
            await tx.user_points.create({
              data: {
                block_number: user.latestBlockNumber,
                user_address: user.user_address,
                points: bigIntToDecimal(bonusPoints),
                cummulative_points: bigIntToDecimal(bonusPoints),
                type: UserPointsType.Bonus,
              },
            });

            // update the aggregated points
            await tx.points_aggregated.upsert({
              where: {
                user_address: user.user_address,
              },
              update: {
                total_points: {
                  increment: bonusPoints,
                },
                timestamp: endTimestamp,
              },
              create: {
                user_address: user.user_address,
                total_points: bonusPoints,
                block_number: user.latestBlockNumber,
                timestamp: endTimestamp,
              },
            });

            batchBonusAwarded += bonusPoints;
          } else {
            logger.warn(
              `Six month bonus already exists for user ${user.user_address} at block ${user.latestBlockNumber}`,
            );
          }
        }
      }

      return {
        processed: users.length,
        bonusAwarded: batchBonusAwarded,
      };
    });
  }

  // simple confirmation prompt
  private async confirmProceed(): Promise<boolean> {
    logger.info('Existing bonus records found. Proceeding with caution...');
    return true;
  }

  // get summary of early user bonus eligibility
  async getEarlyUserBonusSummary(): Promise<{
    totalEligibleUsers: number;
    totalPointsBeforeCutoff: bigint;
    totalBonusToBeAwarded: bigint;
    cutoffDate: Date;
  }> {
    const eligibleUsers = await this.getUsersWithPointsBeforeCutoff();

    const totalPointsBeforeCutoff = eligibleUsers.reduce(
      (sum, user) => sum + user.pointsBeforeCutoff,
      BigInt(0),
    );

    const totalBonusToBeAwarded =
      (totalPointsBeforeCutoff * BigInt(EARLY_USER_BONUS_PERCENTAGE)) / BigInt(100);

    return {
      totalEligibleUsers: eligibleUsers.length,
      totalPointsBeforeCutoff,
      totalBonusToBeAwarded,
      cutoffDate: EARLY_USER_CUTOFF_DATE,
    };
  }

  // get summary of six month bonus eligibility
  async getSixMonthBonusSummary(): Promise<{
    totalEligibleUsers: number;
    totalBonusToBeAwarded: bigint;
    period: {
      startDate: Date;
      endDate: Date;
    };
    bonusMultiplier: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - SIX_MONTHS_DAYS);

    const eligibleUsers = await this.getUsersWithMinimumHoldings(startDate, endDate);

    const totalBonusToBeAwarded = eligibleUsers.reduce((sum, user) => {
      const minimumAmountBigInt = BigInt(user.minimumAmount);
      const bonusPoints =
        (minimumAmountBigInt *
          BigInt(SIX_MONTHS_DAYS) *
          BigInt(Math.floor(SIX_MONTH_BONUS_MULTIPLIER * 100))) /
        BigInt(100);
      return sum + bonusPoints;
    }, BigInt(0));

    return {
      totalEligibleUsers: eligibleUsers.length,
      totalBonusToBeAwarded,
      period: {
        startDate,
        endDate,
      },
      bonusMultiplier: SIX_MONTH_BONUS_MULTIPLIER,
    };
  }

  // validate that early user bonus calculation is accurate and hasn't been tampered with
  async validateEarlyUserBonusCalculation(pointsMultiplier: number): Promise<{
    isValid: boolean;
    discrepancies: Array<{
      user_address: string;
      expected: bigint;
      actual: bigint;
      difference: bigint;
    }>;
  }> {
    const eligibleUsers = await this.getUsersWithPointsBeforeCutoff();
    const discrepancies: Array<{
      user_address: string;
      expected: bigint;
      actual: bigint;
      difference: bigint;
    }> = [];

    for (const user of eligibleUsers) {
      const expectedBonus =
        (user.pointsBeforeCutoff * BigInt(pointsMultiplier * 10000)) / BigInt(10000);

      const actualBonus = await this.prisma.user_points.findUnique({
        where: {
          block_number_user_address_type: {
            block_number: user.latestBlockBeforeCutoff,
            user_address: user.user_address,
            type: UserPointsType.Early,
          },
        },
      });

      const actualBonusPoints = actualBonus ? BigInt(actualBonus.points.toString()) : BigInt(0);

      if (expectedBonus !== actualBonusPoints) {
        discrepancies.push({
          user_address: user.user_address,
          expected: expectedBonus,
          actual: actualBonusPoints,
          difference: expectedBonus - actualBonusPoints,
        });
      }
    }

    return {
      isValid: discrepancies.length === 0,
      discrepancies,
    };
  }

  // validate that six month bonus calculation is accurate
  async validateSixMonthBonusCalculation(): Promise<{
    isValid: boolean;
    discrepancies: Array<{
      user_address: string;
      minimumAmount: string;
      expected: bigint;
      actual: bigint;
      difference: bigint;
    }>;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - SIX_MONTHS_DAYS);

    const eligibleUsers = await this.getUsersWithMinimumHoldings(startDate, endDate);
    const discrepancies: Array<{
      user_address: string;
      minimumAmount: string;
      expected: bigint;
      actual: bigint;
      difference: bigint;
    }> = [];

    for (const user of eligibleUsers) {
      const minimumAmountBigInt = BigInt(user.minimumAmount);
      const expectedBonus =
        (minimumAmountBigInt *
          BigInt(SIX_MONTHS_DAYS) *
          BigInt(Math.floor(SIX_MONTH_BONUS_MULTIPLIER * 100))) /
        BigInt(100);

      // get all bonus records for this user
      const bonusRecords = await this.prisma.user_points.findMany({
        where: {
          user_address: user.user_address,
          type: UserPointsType.Bonus,
        },
      });

      // calculate total bonus points (including early user bonus and six month bonus)
      const totalActualBonus = bonusRecords.reduce((sum, record) => {
        return sum + BigInt(record.points.toString());
      }, BigInt(0));

      // for validation, we check if the expected six month bonus exists
      const hasSixMonthBonus = bonusRecords.some((record) => {
        const recordPoints = BigInt(record.points.toString());
        return recordPoints === expectedBonus;
      });

      if (!hasSixMonthBonus) {
        discrepancies.push({
          user_address: user.user_address,
          minimumAmount: user.minimumAmount,
          expected: expectedBonus,
          actual: BigInt(0), // no six month bonus found
          difference: expectedBonus,
        });
      }
    }

    return {
      isValid: discrepancies.length === 0,
      discrepancies,
    };
  }

  // get detailed breakdown for a specific user
  async getUserSixMonthBonusBreakdown(userAddress: string): Promise<{
    user_address: string;
    minimumAmount: string;
    bonusPoints: bigint;
    period: {
      startDate: Date;
      endDate: Date;
    };
    dailyBalances: Array<{
      date: string;
      total_amount: string;
      block_number: number;
    }>;
  } | null> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - SIX_MONTHS_DAYS);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // get all balance records for this user in the period
    const userBalances = await this.prisma.user_balances.findMany({
      where: {
        user_address: userAddress,
        timestamp: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      select: {
        total_amount: true,
        block_number: true,
        date: true,
        timestamp: true,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    if (userBalances.length === 0) {
      return null;
    }

    // find the minimum total_amount
    const minimumAmount = userBalances.reduce((min, balance) => {
      const current = BigInt(balance.total_amount);
      const minimum = BigInt(min);
      return current < minimum ? balance.total_amount : min;
    }, userBalances[0].total_amount);

    // calculate bonus points
    const minimumAmountBigInt = BigInt(minimumAmount);
    const bonusPoints =
      (minimumAmountBigInt *
        BigInt(SIX_MONTHS_DAYS) *
        BigInt(Math.floor(SIX_MONTH_BONUS_MULTIPLIER * 100))) /
      BigInt(100);

    return {
      user_address: userAddress,
      minimumAmount,
      bonusPoints,
      period: {
        startDate,
        endDate,
      },
      dailyBalances: userBalances.map((balance) => ({
        date: balance.date,
        total_amount: balance.total_amount,
        block_number: balance.block_number,
      })),
    };
  }
}
