import { Injectable } from '@nestjs/common';
import { UserPointsType } from '@prisma/my-client';

import { logger, standariseAddress } from '../../common/utils';
import { bigIntToDecimal, prisma } from '../utils';

const BATCH_SIZE = 100;

interface EligibleUser {
  user_address: string;
  total_points: bigint;
  bonus_points: bigint;
}

interface PriorityBonusSummary {
  totalEligibleReferees: number;
  totalCurrentPoints: bigint;
  totalBonusToBeAwarded: bigint;
  usersWithExistingPriorityBonus: number;
  eligibleUsers: EligibleUser[];
}

interface PriorityBonusResult {
  usersProcessed: number;
  totalBonusAwarded: bigint;
  usersSkipped: number;
}

interface ValidationResult {
  isValid: boolean;
  discrepancies: Array<{
    user_address: string;
    expected: bigint;
    actual: bigint;
    difference: bigint;
  }>;
}

@Injectable()
export class PriorityBonusService {
  private prisma = prisma;

  async getPriorityBonusSummary(ReferrsToConsider: string[]): Promise<PriorityBonusSummary> {
    // get all eligible referees (users who were referred by valid referrers)
    const eligibleReferees = await this.prisma.deposits_with_referral.findMany({
      where: {
        referrer: {
          in: ReferrsToConsider,
        },
      },
      select: {
        referee: true,
      },
      distinct: ['referee'],
    });

    const refereeAddresses = eligibleReferees.map((r) => standariseAddress(r.referee));
    console.log(`Found ${refereeAddresses.length} eligible referees for priority bonus`);
    
    if (refereeAddresses.length === 0) {
      return {
        totalEligibleReferees: 0,
        totalCurrentPoints: BigInt(0),
        totalBonusToBeAwarded: BigInt(0),
        usersWithExistingPriorityBonus: 0,
        eligibleUsers: [],
      };
    }

    // get aggregated points for these users
    const aggregatedPoints = await this.prisma.points_aggregated.findMany({
      where: {
        user_address: {
          in: refereeAddresses,
        },
      },
    });
    console.log(`Found ${aggregatedPoints.length} users with aggregated points`);

    // check which users already have Priority bonus points
    const existingPriorityBonuses = await this.prisma.user_points.findMany({
      where: {
        user_address: {
          in: refereeAddresses,
        },
        type: UserPointsType.Priority,
      },
      select: {
        user_address: true,
      },
      distinct: ['user_address'],
    });

    const usersWithExistingBonus = new Set(existingPriorityBonuses.map((p) => p.user_address));
    console.log(`Found ${usersWithExistingBonus.size} users with existing Priority bonus`);

    // filter out users who already have priority bonus
    const eligibleUsers = aggregatedPoints
      .filter((user) => !usersWithExistingBonus.has(user.user_address))
      .map((user) => ({
        user_address: user.user_address,
        total_points: user.total_points,
        bonus_points: user.total_points, // double the points (100% bonus)
      }));
    console.log(`Eligible users for priority bonus: ${eligibleUsers.length}`);

    const totalCurrentPoints = eligibleUsers.reduce(
      (sum, user) => sum + user.total_points,
      BigInt(0),
    );
    const totalBonusToBeAwarded = eligibleUsers.reduce(
      (sum, user) => sum + user.bonus_points,
      BigInt(0),
    );

    return {
      totalEligibleReferees: eligibleUsers.length,
      totalCurrentPoints,
      totalBonusToBeAwarded,
      usersWithExistingPriorityBonus: usersWithExistingBonus.size,
      eligibleUsers,
    };
  }

  //  calculate and award priority bonus points
  async calculateAndAwardPriorityBonus(summary: PriorityBonusSummary, cutOffBlock: number): Promise<PriorityBonusResult> {
    logger.info('Starting priority bonus calculation...');

    if (summary.eligibleUsers.length === 0) {
      logger.info('No eligible users found for priority bonus.');
      return {
        usersProcessed: 0,
        totalBonusAwarded: BigInt(0),
        usersSkipped: 0,
      };
    }

    let totalBonusAwarded = BigInt(0);
    let usersSkipped = 0;
    let usersProcessed = 0;

    for (let i = 0; i < summary.eligibleUsers.length; i += BATCH_SIZE) {
      const batch = summary.eligibleUsers.slice(i, i + BATCH_SIZE);

      await this.prisma.$transaction(async (tx) => {
        for (const user of batch) {
          try {
            const existingPriorityBonus = await tx.user_points.findFirst({
              where: {
                user_address: user.user_address,
                type: UserPointsType.Priority,
              },
            });

            if (existingPriorityBonus) {
              logger.warn(`User ${user.user_address} already has Priority bonus, skipping`);
              usersSkipped++;
              continue;
            }

            await tx.user_points.create({
              data: {
                block_number: cutOffBlock,
                user_address: user.user_address,
                points: bigIntToDecimal(user.bonus_points),
                cummulative_points: bigIntToDecimal(user.bonus_points),
                type: UserPointsType.Priority,
              },
            });

            await tx.points_aggregated.update({
              where: {
                user_address: user.user_address,
              },
              data: {
                total_points: {
                  increment: user.bonus_points,
                },
              },
            });

            usersProcessed++;
            totalBonusAwarded += user.bonus_points;

            if (usersProcessed % 50 === 0) {
              logger.info(`Processed ${usersProcessed}/${summary.eligibleUsers.length} users...`);
            }
          } catch (error) {
            logger.error(`Error processing user ${user.user_address}:`, error);
            throw error;
          }
        }
      }, { timeout: 300000 });
    }

    logger.info(`Successfully processed ${usersProcessed} users for priority bonus`);

    return {
      usersProcessed,
      totalBonusAwarded,
      usersSkipped,
    };
  }

  // validate that priority bonus calculation is correct
  async validatePriorityBonusCalculation(summary: PriorityBonusSummary): Promise<ValidationResult> {
    logger.info('Validating priority bonus calculation...');

    // get actual Priority bonus points from database
    const actualPriorityPoints = await this.prisma.user_points.findMany({
      where: {
        type: UserPointsType.Priority,
        user_address: {
          in: summary.eligibleUsers.map((u) => u.user_address),
        },
      },
    });

    const actualPointsMap = new Map<string, bigint>();
    actualPriorityPoints.forEach((point) => {
      const existing = actualPointsMap.get(point.user_address) || BigInt(0);
      actualPointsMap.set(point.user_address, existing + BigInt(point.points.toString()));
    });

    const discrepancies: ValidationResult['discrepancies'] = [];

    for (const user of summary.eligibleUsers) {
      const expectedBonus = user.bonus_points;
      const actualBonus = actualPointsMap.get(user.user_address) || BigInt(0);

      if (expectedBonus !== actualBonus) {
        discrepancies.push({
          user_address: user.user_address,
          expected: expectedBonus,
          actual: actualBonus,
          difference: expectedBonus - actualBonus,
        });
      }
    }

    logger.info(
      discrepancies.length === 0
        ? 'Priority bonus validation passed.'
        : `Priority bonus validation found ${discrepancies.length} discrepancies.`,
    );

    return {
      isValid: discrepancies.length === 0,
      discrepancies,
    };
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
