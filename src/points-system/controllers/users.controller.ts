import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

import { logger } from '../../common/utils';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {
    console.log('UsersController constructor - usersService:', !!this.usersService);
  }

  // get all users with their complete details
  @Get()
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('sortBy') sortBy: string = 'total_points',
    @Query('sortOrder') sortOrder: string = 'desc',
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
        return {
          success: false,
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-1000',
        };
      }

      const result = await this.usersService.getAllUsersWithDetails({
        page: pageNum,
        limit: limitNum,
        sortBy: sortBy as 'total_points' | 'user_address' | 'created_on',
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      return {
        success: true,
        data: {
          users: result.users.map((user) => ({
            ...user,
            total_points: user.total_points.toString(),
            regular_points: user.regular_points.toString(),
            bonus_points: user.bonus_points.toString(),
            referrer_points: user.referrer_points.toString(),
          })),
          pagination: result.pagination,
          summary: {
            ...result.summary,
            total_points_all_users: result.summary.total_points_all_users.toString(),
          },
        },
      };
    } catch (error) {
      logger.error('Error getting all users:', error);
      return {
        success: false,
        message: 'Error retrieving users',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // get specific user details by address
  @Get(':address')
  async getUserDetails(@Param('address') address: string) {
    try {
      const userDetails = await this.usersService.getUserCompleteDetails(address);

      if (!userDetails) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: {
          ...userDetails,
          points: {
            ...userDetails.points,
            total_points: userDetails.points.total_points.toString(),
            regular_points: userDetails.points.regular_points.toString(),
            bonus_points: userDetails.points.bonus_points.toString(),
            referrer_points: userDetails.points.referrer_points.toString(),
          },
          eligibility: {
            ...userDetails.eligibility,
            early_user_bonus: {
              ...userDetails.eligibility.early_user_bonus,
              points_before_cutoff:
                userDetails.eligibility.early_user_bonus.points_before_cutoff?.toString(),
              bonus_awarded: userDetails.eligibility.early_user_bonus.bonus_awarded?.toString(),
            },
            six_month_bonus: {
              ...userDetails.eligibility.six_month_bonus,
              minimum_amount: userDetails.eligibility.six_month_bonus.minimum_amount?.toString(),
              bonus_awarded: userDetails.eligibility.six_month_bonus.bonus_awarded?.toString(),
            },
            referral_bonus: {
              ...userDetails.eligibility.referral_bonus,
              bonus_awarded: userDetails.eligibility.referral_bonus.bonus_awarded?.toString(),
            },
          },
        },
      };
    } catch (error) {
      logger.error(`Error getting user details for ${address}:`, error);
      return {
        success: false,
        message: 'Error retrieving user details',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // get user points breakdown
  @Get(':address/points')
  async getUserPointsBreakdown(@Param('address') address: string) {
    try {
      const pointsBreakdown = await this.usersService.getUserPointsBreakdown(address);

      return {
        success: true,
        data: {
          ...pointsBreakdown,
          summary: {
            ...pointsBreakdown.summary,
            total_points: pointsBreakdown.summary.total_points.toString(),
            regular_points: pointsBreakdown.summary.regular_points.toString(),
            bonus_points: pointsBreakdown.summary.bonus_points.toString(),
            referrer_points: pointsBreakdown.summary.referrer_points.toString(),
          },
          history: pointsBreakdown.history.map((record) => ({
            ...record,
            points: record.points.toString(),
            cummulative_points: record.cummulative_points.toString(),
          })),
        },
      };
    } catch (error) {
      logger.error(`Error getting points breakdown for ${address}:`, error);
      return {
        success: false,
        message: 'Error retrieving points breakdown',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // get user eligibility details
  @Get(':address/eligibility')
  async getUserEligibility(@Param('address') address: string) {
    try {
      const eligibility = await this.usersService.getUserEligibilityDetails(address);

      return {
        success: true,
        data: {
          ...eligibility,
          early_user_bonus: {
            ...eligibility.early_user_bonus,
            points_before_cutoff: eligibility.early_user_bonus.points_before_cutoff?.toString(),
            bonus_awarded: eligibility.early_user_bonus.bonus_awarded?.toString(),
          },
          six_month_bonus: {
            ...eligibility.six_month_bonus,
            minimum_amount: eligibility.six_month_bonus.minimum_amount?.toString(),
            bonus_awarded: eligibility.six_month_bonus.bonus_awarded?.toString(),
          },
          referral_bonus: {
            ...eligibility.referral_bonus,
            bonus_awarded: eligibility.referral_bonus.bonus_awarded?.toString(),
          },
        },
      };
    } catch (error) {
      logger.error(`Error getting eligibility for ${address}:`, error);
      return {
        success: false,
        message: 'Error retrieving eligibility details',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // get user balance history
  @Get(':address/balances')
  async getUserBalanceHistory(
    @Param('address') address: string,
    @Query('days') days: string = '30',
  ) {
    try {
      const daysNum = parseInt(days, 10);
      if (daysNum < 1 || daysNum > 365) {
        return {
          success: false,
          message: 'Days parameter must be between 1 and 365',
        };
      }

      const balanceHistory = await this.usersService.getUserBalanceHistory(address, daysNum);

      return {
        success: true,
        data: balanceHistory,
      };
    } catch (error) {
      logger.error(`Error getting balance history for ${address}:`, error);
      return {
        success: false,
        message: 'Error retrieving balance history',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // get users statistics
  @Get('stats/overview')
  async getUsersStats() {
    try {
      const stats = await this.usersService.getUsersStatistics();

      return {
        success: true,
        data: {
          ...stats,
          total_points_distributed: stats.total_points_distributed.toString(),
          points_by_type: {
            regular: stats.points_by_type.regular.toString(),
            bonus: stats.points_by_type.bonus.toString(),
            referrer: stats.points_by_type.referrer.toString(),
          },
        },
      };
    } catch (error) {
      logger.error('Error getting users statistics:', error);
      return {
        success: false,
        message: 'Error retrieving statistics',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
