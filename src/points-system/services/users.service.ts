import { Injectable } from '@nestjs/common';
import { UserPointsType } from '@prisma/my-client';

import { safeToBigInt, standariseAddress } from '../../common/utils';
import { calculatePoints, prisma } from '../utils';

const EARLY_USER_CUTOFF_DATE = new Date('2025-05-25T23:59:59.999Z');
const SIX_MONTHS_DAYS = 180;
const SIX_MONTH_BONUS_MULTIPLIER = 0.2;
const POINTS_MULTIPLIER = 1;

interface UserSummary {
  user_address: string;
  total_points: bigint;
  // regular_points: bigint;
  // bonus_points: bigint;
  // referrer_points: bigint;
  // allocation?: string;
  // first_activity_date?: Date;
  // last_activity_date?: Date;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: 'total_points' | 'user_address' | 'created_on';
  sortOrder: 'asc' | 'desc';
}

interface PaginatedUsersResult {
  users: UserSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total_users: number;
    total_points_all_users: bigint;
  };
}

interface UserCompleteDetails {
  user_address: string;
  points: {
    total_points: bigint;
    regular_points: bigint;
    bonus_points: bigint;
    priority_points: bigint;
  };
  allocation: string;
  // activity: {
  //   first_activity_date?: Date;
  //   last_activity_date?: Date;
  //   total_deposits: number;
  //   total_withdrawals: number;
  // };
  // eligibility: {
  //   early_user_bonus: {
  //     eligible: boolean;
  //     points_before_cutoff?: bigint;
  //     bonus_awarded?: bigint;
  //     cutoff_date: Date;
  //   };
  //   six_month_bonus: {
  //     eligible: boolean;
  //     minimum_amount?: bigint;
  //     bonus_awarded?: bigint;
  //     period: {
  //       start_date: Date;
  //       end_date: Date;
  //     };
  //   };
  //   referral_bonus: {
  //     eligible: boolean;
  //     is_referred_user: boolean;
  //     referrer_address?: string;
  //     bonus_awarded?: bigint;
  //   };
  // };
  tags: {
    early_adopter: boolean;
  };
}

@Injectable()
export class UsersService {
  private prisma = prisma;

  async getAllUsersWithDetails(options: PaginationOptions): Promise<PaginatedUsersResult> {
    const offset = (options.page - 1) * options.limit;

    // get total count
    const totalUsers = await this.prisma.points_aggregated.count();

    // build order by clause
    let orderBy: any;
    switch (options.sortBy) {
      case 'total_points':
        orderBy = { total_points: options.sortOrder };
        break;
      case 'user_address':
        orderBy = { user_address: options.sortOrder };
        break;
      case 'created_on':
        orderBy = { created_on: options.sortOrder };
        break;
      default:
        orderBy = { total_points: 'desc' };
    }

    // get paginated users
    const aggregatedPoints = await this.prisma.points_aggregated.findMany({
      skip: offset,
      take: options.limit,
      orderBy,
      select: {
        user_address: true,
        total_points: true,
      }
    });

    // const userAddresses = aggregatedPoints.map((u) => u.user_address);

    // get points breakdown for all users
    // const allUserPoints = await this.prisma.user_points.groupBy({
    //   by: ['user_address', 'type'],
    //   where: {
    //     user_address: {
    //       in: userAddresses,
    //     },
    //   },
    //   _sum: {
    //     points: true,
    //   },
    // });

    // get activity dates
    // const activityDates = await this.prisma.users.findMany({
    //   where: {
    //     user_address: {
    //       in: userAddresses,
    //     },
    //   },
    //   select: {
    //     user_address: true,
    //     timestamp: true,
    //   },
    // });

    // organize data
    const users: UserSummary[] = aggregatedPoints.map((user) => {
      // const userPoints = allUserPoints.filter((p) => p.user_address === user.user_address);

      // const regular_points = userPoints
      //   .filter((p) => p.type === UserPointsType.Regular)
      //   .reduce((sum, p) => sum + safeToBigInt(p._sum.points), BigInt(0));

      // const bonus_points = userPoints
      //   .filter((p) => p.type === UserPointsType.Bonus)
      //   .reduce((sum, p) => sum + safeToBigInt(p._sum.points), BigInt(0));

      // const referrer_points = userPoints
      //   .filter((p) => p.type === UserPointsType.Referrer)
      //   .reduce((sum, p) => sum + safeToBigInt(p._sum.points), BigInt(0));

      // const activityDate = activityDates.find((a) => a.user_address === user.user_address);

      return {
        user_address: user.user_address,
        total_points: safeToBigInt(user.total_points),
        // regular_points,
        // bonus_points,
        // referrer_points,
        // allocation: user.user_allocation?.allocation,
        // first_activity_date: activityDate ? new Date(activityDate.timestamp * 1000) : undefined,
        // last_activity_date: user.updated_on ? new Date(user.updated_on) : undefined,
      };
    });

    // calculate summary
    const total_points_all_users = users.reduce(
      (sum, user) => sum + user.total_points,
      BigInt(0),
    );

    return {
      users,
      pagination: {
        page: options.page,
        limit: options.limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / options.limit),
      },
      summary: {
        total_users: totalUsers,
        total_points_all_users: safeToBigInt(total_points_all_users),
      },
    };
  }

  async getUserCompleteDetails(userAddress: string): Promise<UserCompleteDetails | null> {
    // check if user exists
    console.log(`getUserCompleteDetails`, userAddress);
    const userAddr = standariseAddress(userAddress);
    const aggregatedPoints = await this.prisma.points_aggregated.findUnique({
      where: {
        user_address: userAddr,
      },
      include: {
        user_allocation: true,
      },
    });

    if (!aggregatedPoints) {
      return null;
    }

    // get points breakdown
    const pointsBreakdown = await this.getUserPointsBreakdown(userAddr);

    // get activity details
    // const activityDetails = await this.getUserActivityDetails(userAddress);

    // get eligibility details
    // const eligibilityDetails = await this.getUserEligibilityDetails(userAddress);

    const tagsDetails = await this.getUserTags(userAddr);

    return {
      user_address: userAddress,
      points: (pointsBreakdown?.summary && pointsBreakdown.summary) || {
        total_points: BigInt(0),
        regular_points: BigInt(0),
        bonus_points: BigInt(0),
        priority_points: BigInt(0),
      },
      allocation: aggregatedPoints.user_allocation?.allocation || '0',
      // activity: activityDetails,
      // eligibility: eligibilityDetails,
      tags: tagsDetails,
    };
  }

  async getUserPointsBreakdown(userAddress: string): Promise<{
    user_address: string;
    summary: {
      total_points: bigint;
      regular_points: bigint;
      bonus_points: bigint;
      priority_points: bigint;
    };
    history: Array<{
      block_number: number;
      points: bigint;
      cummulative_points: bigint;
      type: UserPointsType;
    }>;
  }> {
    const userAddr = standariseAddress(userAddress);
    const allPoints = await this.prisma.user_points.findMany({
      where: {
        user_address: userAddr,
      },
      orderBy: {
        block_number: 'desc',
      },
    });

    const result = await this.prisma.points_aggregated.findFirst({
      where: {
        user_address: userAddr,
      },
      orderBy: {
        block_number: 'desc',
      },
      select: {
        total_points: true,
      },
    });

    let total_points = safeToBigInt(result?.total_points || BigInt(0));

    // calculate summary
    const bonus_points = allPoints
      .filter((p) => p.type === UserPointsType.Bonus)
      .reduce((sum, p) => sum + safeToBigInt(p.points), BigInt(0));

    const priority_points = allPoints
      .filter((p) => p.type === UserPointsType.Priority)
      .reduce((sum, p) => sum + safeToBigInt(p.points), BigInt(0));


    return {
      user_address: userAddress,
      summary: {
        total_points,
        regular_points: total_points - bonus_points - priority_points,
        bonus_points,
        priority_points,
      },
      // history: allPoints.map((p) => ({
      //   block_number: p.block_number,
      //   points: safeToBigInt(p.points),
      //   cummulative_points: safeToBigInt(p.cummulative_points),
      //   type: p.type,
      // })),
      history: [], // no extra details for now
    };
  }

  async getUserActivityDetails(userAddress: string): Promise<{
    first_activity_date?: Date;
    last_activity_date?: Date;
    total_deposits: number;
    total_withdrawals: number;
  }> {
    // get first activity
    const userAddr = standariseAddress(userAddress);
    const firstActivity = await this.prisma.users.findUnique({
      where: {
        user_address: userAddr,
      },
    });

    // get deposits count
    const depositsCount = await this.prisma.deposits.count({
      where: {
        owner: userAddr,
      },
    });

    // get withdrawals count
    const withdrawalsCount = await this.prisma.withdraw_queue.count({
      where: {
        receiver: userAddr,
      },
    });

    // get last activity from aggregated points
    const lastActivity = await this.prisma.points_aggregated.findUnique({
      where: {
        user_address: userAddr,
      },
    });

    return {
      first_activity_date: firstActivity ? new Date(firstActivity.timestamp * 1000) : undefined,
      last_activity_date: lastActivity ? new Date(lastActivity.updated_on) : undefined,
      total_deposits: depositsCount || 0,
      total_withdrawals: withdrawalsCount || 0,
    };
  }

  async getUserEligibilityDetails(userAddress: string): Promise<{
    early_user_bonus: {
      eligible: boolean;
      points_before_cutoff?: bigint;
      bonus_awarded?: bigint;
      cutoff_date: Date;
    };
    six_month_bonus: {
      eligible: boolean;
      minimum_amount?: bigint;
      bonus_awarded?: bigint;
      period: {
        start_date: Date;
        end_date: Date;
      };
    };
    referral_bonus: {
      eligible: boolean;
      is_referred_user: boolean;
      referrer_address?: string;
      bonus_awarded?: bigint;
    };
  }> {
    // early user bonus eligibility
    const earlyUserEligibility = await this.checkEarlyUserBonusEligibility(userAddress);

    // six month bonus eligibility
    const sixMonthEligibility = await this.checkSixMonthBonusEligibility(userAddress);

    // referral bonus eligibility
    const referralEligibility = await this.checkReferralBonusEligibility(userAddress);

    return {
      early_user_bonus: earlyUserEligibility,
      six_month_bonus: sixMonthEligibility,
      referral_bonus: referralEligibility,
    };
  }

  private async checkEarlyUserBonusEligibility(userAddress: string) {
    const userAddr = standariseAddress(userAddress);
    // get cutoff block
    const cutoffBlock = await this.prisma.blocks.findFirst({
      where: {
        timestamp: {
          lte: Math.floor(EARLY_USER_CUTOFF_DATE.getTime() / 1000),
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!cutoffBlock) {
      return {
        eligible: false,
        cutoff_date: EARLY_USER_CUTOFF_DATE,
      };
    }

    // check if user had balance before cutoff
    const balanceBeforeCutoff = await this.prisma.user_balances.findFirst({
      where: {
        user_address: userAddr,
        block_number: {
          lte: cutoffBlock.block_number,
        },
      },
      orderBy: {
        block_number: 'desc',
      },
    });

    let points_before_cutoff: bigint | undefined;
    if (balanceBeforeCutoff) {
      points_before_cutoff = calculatePoints(
        balanceBeforeCutoff.total_amount,
        POINTS_MULTIPLIER,
      ) as bigint;
    }

    // check if bonus was awarded
    const bonusAwarded = await this.prisma.user_points.findFirst({
      where: {
        user_address: userAddr,
        type: UserPointsType.Bonus,
        block_number: {
          lte: cutoffBlock.block_number,
        },
      },
    });

    return {
      eligible: !!balanceBeforeCutoff && (points_before_cutoff || BigInt(0)) > 0,
      points_before_cutoff: points_before_cutoff || BigInt(0),
      bonus_awarded: bonusAwarded ? safeToBigInt(bonusAwarded.points) : BigInt(0),
      cutoff_date: EARLY_USER_CUTOFF_DATE,
    };
  }

  private async checkSixMonthBonusEligibility(userAddress: string) {
    const userAddr = standariseAddress(userAddress);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - SIX_MONTHS_DAYS);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // get user balances in the period
    const userBalances = await this.prisma.user_balances.findMany({
      where: {
        user_address: userAddr,
        timestamp: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      select: {
        total_amount: true,
      },
    });

    let minimum_amount: bigint | undefined;
    if (userBalances.length > 0) {
      minimum_amount = userBalances.reduce((min, balance) => {
        const current = safeToBigInt(balance.total_amount);
        return current < min ? current : min;
      }, safeToBigInt(userBalances[0].total_amount));
    }

    // check if six month bonus was awarded
    const bonusAwarded = await this.prisma.user_points.findFirst({
      where: {
        user_address: userAddr,
        type: UserPointsType.Bonus,
      },
    });

    // calculate expected bonus
    let expectedBonus = BigInt(0);
    if (minimum_amount && minimum_amount > 0) {
      expectedBonus =
        (minimum_amount *
          BigInt(SIX_MONTHS_DAYS) *
          BigInt(Math.floor(SIX_MONTH_BONUS_MULTIPLIER * 100))) /
        BigInt(100);
    }

    return {
      eligible: !!minimum_amount && minimum_amount > 0,
      minimum_amount: minimum_amount || BigInt(0),
      bonus_awarded:
        bonusAwarded && safeToBigInt(bonusAwarded.points) === expectedBonus
          ? expectedBonus
          : BigInt(0),
      period: {
        start_date: startDate,
        end_date: endDate,
      },
    };
  }

  private async checkReferralBonusEligibility(userAddress: string) {
    // check if user was referred
    const userAddr = standariseAddress(userAddress);
    const referralRecord = await this.prisma.deposits_with_referral.findFirst({
      where: {
        referee: userAddr,
      },
    });

    // check if referral bonus was awarded
    const bonusAwarded = await this.prisma.user_points.findFirst({
      where: {
        user_address: userAddr,
        type: UserPointsType.Referrer,
      },
    });

    return {
      eligible: !!referralRecord,
      is_referred_user: !!referralRecord,
      referrer_address: referralRecord?.referrer,
      bonus_awarded: bonusAwarded ? safeToBigInt(bonusAwarded.points) : BigInt(0),
    };
  }

  async getUserBalanceHistory(
    userAddress: string,
    days: number,
  ): Promise<
    Array<{
      date: string;
      total_amount: string;
      vesuAmount: string;
      ekuboAmount: string;
      nostraLendingAmount: string;
      nostraDexAmount: string;
      walletAmount: string;
      strkfarmAmount: string;
      block_number: number;
    }>
  > {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const userAddr = standariseAddress(userAddress);
    const balances = await this.prisma.user_balances.findMany({
      where: {
        user_address: userAddr,
        timestamp: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return balances.map((balance) => ({
      date: balance.date,
      total_amount: balance.total_amount,
      vesuAmount: balance.vesuAmount,
      ekuboAmount: balance.ekuboAmount,
      nostraLendingAmount: balance.nostraLendingAmount,
      nostraDexAmount: balance.nostraDexAmount,
      walletAmount: balance.walletAmount,
      strkfarmAmount: balance.strkfarmAmount,
      block_number: balance.block_number,
    }));
  }

  async getUsersStatistics(): Promise<{
    total_users: number;
    users_with_points: number;
    users_with_allocation: number;
    total_points_distributed: bigint;
    points_by_type: {
      regular: bigint;
      bonus: bigint;
      referrer: bigint;
    };
    average_points_per_user: number;
  }> {
    // total users
    const totalUsers = await this.prisma.users.count();

    // users with points
    const usersWithPoints = await this.prisma.points_aggregated.count();

    // users with allocation
    const usersWithAllocation = await this.prisma.user_allocation.count();

    // total points distributed
    const totalPointsResult = await this.prisma.points_aggregated.aggregate({
      _sum: {
        total_points: true,
      },
    });

    // points by type
    const pointsByType = await this.prisma.user_points.groupBy({
      by: ['type'],
      _sum: {
        points: true,
      },
    });

    const regular = pointsByType.find((p) => p.type === UserPointsType.Regular)?._sum.points || 0;
    const bonus = pointsByType.find((p) => p.type === UserPointsType.Bonus)?._sum.points || 0;
    const referrer = pointsByType.find((p) => p.type === UserPointsType.Referrer)?._sum.points || 0;

    const totalPointsDistributed = safeToBigInt(totalPointsResult._sum.total_points);
    const averagePointsPerUser =
      usersWithPoints > 0 ? Number(totalPointsDistributed) / usersWithPoints : 0;

    return {
      total_users: totalUsers,
      users_with_points: usersWithPoints,
      users_with_allocation: usersWithAllocation,
      total_points_distributed: totalPointsDistributed,
      points_by_type: {
        regular: safeToBigInt(regular),
        bonus: safeToBigInt(bonus),
        referrer: safeToBigInt(referrer),
      },
      average_points_per_user: Math.round(averagePointsPerUser),
    };
  }

  async getUserTags(userAddress: string): Promise<{
    early_adopter: boolean;
  }> {
    const userAddr = standariseAddress(userAddress);
    const earlyAdopterPoints = await this.prisma.user_points.findFirst({
      where: {
        user_address: userAddr,
        type: UserPointsType.Early,
        points: {
          gt: 0,
        },
      },
    });

    return {
      early_adopter: !!earlyAdopterPoints,
    };
  }
}
