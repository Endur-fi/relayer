import { Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql';

import { UsersService } from '../points-system/services/users.service';

@InputType()
class PaginationOptionsInput {
  @Field(() => Int, { defaultValue: 1 })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  limit!: number;

  @Field(() => String, { defaultValue: 'total_points' })
  sortBy!: 'total_points' | 'user_address' | 'created_on';

  @Field(() => String, { defaultValue: 'desc' })
  sortOrder!: 'asc' | 'desc';
}

@InputType()
class AddPointsInput {
  @Field(() => String)
  userAddress!: string;

  @Field(() => String)
  points!: string;
}

@ObjectType()
class UserSummary {
  @Field(() => String)
  user_address!: string;

  @Field(() => String) // BigInt as string
  total_points!: string;

  // @Field(() => String)
  // regular_points!: string;

  // @Field(() => String)
  // bonus_points!: string;

  // @Field(() => String)
  // referrer_points!: string;

  // @Field(() => String, { nullable: true })
  // allocation?: string;

  // @Field(() => Date, { nullable: true })
  // first_activity_date?: Date;

  // @Field(() => Date, { nullable: true })
  // last_activity_date?: Date;
}

@ObjectType()
class PaginationInfo {
  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
class UsersSummary {
  @Field(() => Int)
  total_users!: number;

  @Field(() => String)
  total_points_all_users!: string;
}

@ObjectType()
class PaginatedUsersResult {
  @Field(() => [UserSummary])
  users!: UserSummary[];

  @Field(() => PaginationInfo)
  pagination!: PaginationInfo;

  @Field(() => UsersSummary)
  summary!: UsersSummary;
}

@ObjectType()
class PointsSummary {
  @Field(() => String)
  total_points!: string;

  @Field(() => String)
  regular_points!: string;

  @Field(() => String)
  bonus_points!: string;

  @Field(() => String)
  early_adopter_points!: string;

  @Field(() => String)
  follow_bonus_points!: string;

  @Field(() => String, { nullable: true })
  dex_bonus_points!: string;

  // @Field(() => String)
  // priority_points!: string;
}

@ObjectType()
class ActivityDetails {
  @Field(() => Date, { nullable: true })
  first_activity_date?: Date;

  @Field(() => Date, { nullable: true })
  last_activity_date?: Date;

  @Field(() => Int)
  total_deposits!: number;

  @Field(() => Int)
  total_withdrawals!: number;
}

@ObjectType()
class EarlyUserBonus {
  @Field(() => Boolean)
  eligible!: boolean;

  @Field(() => String, { nullable: true })
  points_before_cutoff?: string;

  @Field(() => String, { nullable: true })
  bonus_awarded?: string;

  @Field(() => Date)
  cutoff_date!: Date;
}

@ObjectType()
class SixMonthBonusPeriod {
  @Field(() => Date)
  start_date!: Date;

  @Field(() => Date)
  end_date!: Date;
}

@ObjectType()
class SixMonthBonus {
  @Field(() => Boolean)
  eligible!: boolean;

  @Field(() => String, { nullable: true })
  minimum_amount?: string;

  @Field(() => String, { nullable: true })
  bonus_awarded?: string;

  @Field(() => SixMonthBonusPeriod)
  period!: SixMonthBonusPeriod;
}

@ObjectType()
class ReferralBonus {
  @Field(() => Boolean)
  eligible!: boolean;

  @Field(() => Boolean)
  is_referred_user!: boolean;

  @Field(() => String, { nullable: true })
  referrer_address?: string;

  @Field(() => String, { nullable: true })
  bonus_awarded?: string;
}

@ObjectType()
class EligibilityDetails {
  @Field(() => EarlyUserBonus)
  early_user_bonus!: EarlyUserBonus;

  @Field(() => SixMonthBonus)
  six_month_bonus!: SixMonthBonus;

  @Field(() => ReferralBonus)
  referral_bonus!: ReferralBonus;
}

@ObjectType()
class UserTags {
  @Field(() => Boolean)
  early_adopter!: boolean;
}

@ObjectType()
class UserCompleteDetails {
  @Field(() => String)
  user_address!: string;

  @Field(() => Number)
  rank!: number;

  @Field(() => PointsSummary)
  points!: PointsSummary;

  @Field(() => String, { nullable: true })
  allocation?: string;

  @Field(() => String, { nullable: true })
  merkle_root?: string;

  @Field(() => String, { nullable: true })
  proof?: string;

  // @Field(() => ActivityDetails)
  // activity!: ActivityDetails;

  // @Field(() => EligibilityDetails)
  // eligibility!: EligibilityDetails;

  @Field(() => UserTags)
  tags!: UserTags;
}

@ObjectType()
class PointsHistoryItem {
  @Field(() => Int)
  block_number!: number;

  @Field(() => String)
  points!: string;

  @Field(() => String)
  type!: string;
}

@ObjectType()
class UserPointsBreakdown {
  @Field(() => String)
  user_address!: string;

  @Field(() => PointsSummary)
  summary!: PointsSummary;

  @Field(() => [PointsHistoryItem])
  history!: PointsHistoryItem[];
}

@ObjectType()
class BalanceHistory {
  @Field(() => String)
  date!: string;

  @Field(() => String)
  total_amount!: string;

  @Field(() => String)
  vesuAmount!: string;

  @Field(() => String)
  ekuboAmount!: string;

  @Field(() => String)
  nostraLendingAmount!: string;

  @Field(() => String)
  nostraDexAmount!: string;

  @Field(() => String)
  walletAmount!: string;

  @Field(() => String)
  strkfarmAmount!: string;

  @Field(() => Int)
  block_number!: number;
}

@ObjectType()
class PointsByType {
  @Field(() => String)
  regular!: string;

  @Field(() => String)
  bonus!: string;

  @Field(() => String)
  referrer!: string;
}

@ObjectType()
class UsersStatistics {
  @Field(() => Int)
  total_users!: number;

  @Field(() => Int)
  users_with_points!: number;

  @Field(() => Int)
  users_with_allocation!: number;

  @Field(() => String)
  total_points_distributed!: string;

  @Field(() => PointsByType)
  points_by_type!: PointsByType;

  @Field(() => Int)
  average_points_per_user!: number;
}

@ObjectType()
class AddPointsResult {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;

  @Field(() => String)
  userAddress!: string;

  @Field(() => String)
  pointsAdded!: string;

  @Field(() => String)
  newTotalPoints!: string;
}

@Resolver()
export class UsersResolver {
  private usersService!: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  @Query(() => PaginatedUsersResult)
  async getAllUsersWithDetails(
    @Arg('options', () => PaginationOptionsInput, { nullable: true })
    options?: PaginationOptionsInput,
  ): Promise<PaginatedUsersResult> {
    const paginationOptions = {
      page: options?.page || 1,
      limit: options?.limit || 10,
      sortBy: (options?.sortBy as any) || 'total_points',
      sortOrder: (options?.sortOrder as any) || 'desc',
    };

    const result = await this.usersService.getAllUsersWithDetails(paginationOptions);

    return {
      users: result.users.map((user) => ({
        ...user,
        total_points: user.total_points.toString(),
        // regular_points: user.regular_points.toString(),
        // bonus_points: user.bonus_points.toString(),
        // referrer_points: user.referrer_points.toString(),
      })),
      pagination: result.pagination,
      summary: {
        ...result.summary,
        total_points_all_users: result.summary.total_points_all_users.toString(),
      },
    };
  }

  @Query(() => UserCompleteDetails, { nullable: true })
  async getUserCompleteDetails(
    @Arg('userAddress', () => String) userAddress: string,
  ): Promise<UserCompleteDetails | null> {
    const result = await this.usersService.getUserCompleteDetails(userAddress);

    if (!result) {
      return null;
    }

    return {
      ...result,
      merkle_root: result.merkle_root ?? undefined,
      proof: result.proof ?? undefined,
      points: {
        total_points: result.points.total_points.toString(),
        regular_points: result.points.regular_points.toString(),
        bonus_points: result.points.bonus_points.toString(),
        early_adopter_points: result.points.early_adopter_points.toString(),
        follow_bonus_points: result.points.follow_bonus_points.toString(),
        dex_bonus_points: result.points.dex_bonus_points.toString(),
        // priority_points: result.points.priority_points.toString(),
      },
      // eligibility: {
      //   early_user_bonus: {
      //     ...result.eligibility.early_user_bonus,
      //     points_before_cutoff:
      //       result.eligibility.early_user_bonus.points_before_cutoff?.toString(),
      //     bonus_awarded: result.eligibility.early_user_bonus.bonus_awarded?.toString(),
      //   },
      //   six_month_bonus: {
      //     ...result.eligibility.six_month_bonus,
      //     minimum_amount: result.eligibility.six_month_bonus.minimum_amount?.toString(),
      //     bonus_awarded: result.eligibility.six_month_bonus.bonus_awarded?.toString(),
      //   },
      //   referral_bonus: {
      //     ...result.eligibility.referral_bonus,
      //     bonus_awarded: result.eligibility.referral_bonus.bonus_awarded?.toString(),
      //   },
      // },
    };
  }

  // @Query(() => UserPointsBreakdown, { nullable: true })
  // async getUserPointsBreakdown(
  //   @Arg('userAddress', () => String) userAddress: string,
  // ): Promise<UserPointsBreakdown | null> {
  //   const result = await this.usersService.getUserPointsBreakdown(userAddress);

  //   if (!result) {
  //     return null;
  //   }

  //   return {
  //     ...result,
  //     summary: {
  //       total_points: result.summary.total_points.toString(),
  //       regular_points: result.summary.regular_points.toString(),
  //       bonus_points: result.summary.bonus_points.toString(),
  //       referrer_points: result.summary.priority_points.toString(),
  //     },
  //     history: result.history.map((item) => ({
  //       ...item,
  //       points: item.points.toString(),
  //       cummulative_points: item.cummulative_points.toString(),
  //       type: item.type.toString(),
  //     })),
  //   };
  // }

  // @Query(() => [BalanceHistory])
  // async getUserBalanceHistory(
  //   @Arg('userAddress', () => String) userAddress: string,
  //   @Arg('days', () => Int, { defaultValue: 30 }) days: number,
  // ): Promise<BalanceHistory[]> {
  //   const result = await this.usersService.getUserBalanceHistory(userAddress, days);
  //   return result;
  // }

  // @Query(() => UsersStatistics)
  // async getUsersStatistics(): Promise<UsersStatistics> {
  //   const result = await this.usersService.getUsersStatistics();

  //   return {
  //     ...result,
  //     total_points_distributed: result.total_points_distributed.toString(),
  //     points_by_type: {
  //       regular: result.points_by_type.regular.toString(),
  //       bonus: result.points_by_type.bonus.toString(),
  //       referrer: result.points_by_type.referrer.toString(),
  //     },
  //   };
  // }

  @Query(() => UserTags)
  async getUserTags(@Arg('userAddress', () => String) userAddress: string): Promise<UserTags> {
    const result = await this.usersService.getUserTags(userAddress);
    return result;
  }

  @Mutation(() => AddPointsResult)
  async addPointsToUser(
    @Arg('input', () => AddPointsInput) input: AddPointsInput,
  ): Promise<AddPointsResult> {
    try {
      const result = await this.usersService.addPointsToUser(input.userAddress, input.points);

      return {
        success: result.success,
        message: result.message,
        userAddress: input.userAddress,
        pointsAdded: result.success ? input.points : '0',
        newTotalPoints: result?.data?.newTotalPoints?.toString() ?? '0',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add points',
        userAddress: input.userAddress,
        pointsAdded: '0',
        newTotalPoints: '0',
      };
    }
  }
}
