import { Controller, Get, Param, Post } from '@nestjs/common';

import { logger } from '../../common/utils';
import { BonusService } from '../services/user-bonus.service';

@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  // execute the early user bonus calculation
  @Post('early-user/execute')
  async executeEarlyUserBonus() {
    try {
      logger.info('Starting Early User Bonus execution via API...');
      await this.bonusService.calculateAndAwardEarlyUserBonus();
      return {
        success: true,
        message: 'Early user bonus calculation completed successfully',
      };
    } catch (error) {
      logger.error('Error executing early user bonus:', error);
      return {
        success: false,
        message: 'Error executing early user bonus',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // get a summary of early user bonus eligibility before executing
  @Get('early-user/summary')
  async getEarlyUserBonusSummary() {
    try {
      const summary = await this.bonusService.getEarlyUserBonusSummary();
      return {
        success: true,
        data: {
          ...summary,
          totalPointsBeforeCutoff: summary.totalPointsBeforeCutoff.toString(),
          totalBonusToBeAwarded: summary.totalBonusToBeAwarded.toString(),
          bonusPercentage: 20,
        },
      };
    } catch (error) {
      logger.error('Error getting early user bonus summary:', error);
      return {
        success: false,
        message: 'Error getting early user bonus summary',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // validate that the early user bonus calculation is correct
  // @Get('early-user/validate')
  // async validateEarlyUserBonusCalculation() {
  //   try {
  //     const validation = await this.bonusService.validateEarlyUserBonusCalculation();
  //     return {
  //       success: true,
  //       data: {
  //         isValid: validation.isValid,
  //         totalDiscrepancies: validation.discrepancies.length,
  //         discrepancies: validation.discrepancies.map((d) => ({
  //           ...d,
  //           expected: d.expected.toString(),
  //           actual: d.actual.toString(),
  //           difference: d.difference.toString(),
  //         })),
  //       },
  //     };
  //   } catch (error) {
  //     logger.error('Error validating early user bonus calculation:', error);
  //     return {
  //       success: false,
  //       message: 'Error validating early user bonus calculation',
  //       error: error instanceof Error ? error.message : String(error),
  //     };
  //   }
  // }

  @Get('six-month/summary')
  async getSixMonthBonusSummary() {
    try {
      const summary = await this.bonusService.getSixMonthBonusSummary();
      return {
        success: true,
        data: {
          ...summary,
          totalBonusToBeAwarded: summary.totalBonusToBeAwarded.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @Post('six-month/execute')
  async executeSixMonthBonus() {
    try {
      await this.bonusService.calculateAndAwardSixMonthBonus();
      return {
        success: true,
        message: 'Six month bonus calculation executed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @Get('six-month/validate')
  async validateSixMonthBonus() {
    try {
      const validation = await this.bonusService.validateSixMonthBonusCalculation();
      return {
        success: true,
        data: {
          ...validation,
          discrepancies: validation.discrepancies.map((disc) => ({
            ...disc,
            expected: disc.expected.toString(),
            actual: disc.actual.toString(),
            difference: disc.difference.toString(),
          })),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @Get('six-month/user/:address')
  async getUserSixMonthBonusBreakdown(@Param('address') address: string) {
    try {
      const breakdown = await this.bonusService.getUserSixMonthBonusBreakdown(address);

      if (!breakdown) {
        return {
          success: false,
          message: 'No data found for this user in the last 6 months',
        };
      }

      return {
        success: true,
        data: {
          ...breakdown,
          bonusPoints: breakdown.bonusPoints.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
