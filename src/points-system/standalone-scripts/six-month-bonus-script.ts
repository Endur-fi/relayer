import { logger } from '@strkfarm/sdk';
import * as dotenv from 'dotenv';
dotenv.config();

import { BonusService } from '../services/user-bonus.service';

/**
 * Standalone script to execute Six Month Bonus calculation
 * Usage: node six-month-bonus-script.js [--dry-run] [--summary-only]
 */

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const summaryOnly = args.includes('--summary-only');

  const bonusService = new BonusService();

  try {
    logger.info('='.repeat(80));
    logger.info('SIX MONTH BONUS CALCULATION SCRIPT');
    logger.info('='.repeat(80));

    if (isDryRun) {
      logger.info('🔍 DRY RUN MODE - No changes will be made to the database');
    }

    // always show summary first
    logger.info('📊 Getting Six Month Bonus Summary...');
    const summary = await bonusService.getSixMonthBonusSummary();

    logger.info('📈 SIX MONTH BONUS SUMMARY');
    logger.info('-'.repeat(50));
    logger.info(
      `Period: ${summary.period.startDate.toISOString().split('T')[0]} to ${summary.period.endDate.toISOString().split('T')[0]}`,
    );
    logger.info(`Total Eligible Users: ${summary.totalEligibleUsers}`);
    logger.info(`Total Bonus To Be Awarded: ${summary.totalBonusToBeAwarded}`);
    logger.info(`Bonus Multiplier: ${summary.bonusMultiplier * 100}%`);
    logger.info('-'.repeat(50));

    if (summaryOnly) {
      logger.info('✅ Summary complete. Exiting (summary-only mode).');
      return;
    }

    if (!isDryRun) {
      // confirmation prompt
      logger.info('⚠️  WARNING: This will permanently modify the database!');
      logger.info('Are you sure you want to proceed? (This script will continue in 10 seconds...)');

      // wait 10 seconds for manual intervention
      await new Promise((resolve) => setTimeout(resolve, 10000));

      logger.info('🚀 Proceeding with Six Month Bonus calculation...');

      // execute the bonus calculation
      await bonusService.calculateAndAwardSixMonthBonus();

      // validate the results
      logger.info('🔍 Validating bonus calculation...');
      const validation = await bonusService.validateSixMonthBonusCalculation();

      if (validation.isValid) {
        logger.info('✅ Validation successful! All bonus calculations are correct.');
      } else {
        logger.error(
          `❌ Validation failed! Found ${validation.discrepancies.length} discrepancies:`,
        );
        validation.discrepancies.slice(0, 10).forEach((d) => {
          logger.error(
            `  User: ${d.user_address}, Min Amount: ${d.minimumAmount}, Expected: ${d.expected}, Actual: ${d.actual}, Diff: ${d.difference}`,
          );
        });
        if (validation.discrepancies.length > 10) {
          logger.error(`  ... and ${validation.discrepancies.length - 10} more`);
        }
      }
    } else {
      logger.info('🔍 DRY RUN: Would execute Six Month Bonus calculation');
      logger.info('🔍 DRY RUN: Would validate results');
    }

    logger.info('='.repeat(80));
    logger.info('✅ Script completed successfully!');
    logger.info('='.repeat(80));
  } catch (error) {
    logger.error('❌ Script failed with error:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  logger.info('\n⚠️  Script interrupted by user. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('\n⚠️  Script terminated. Exiting...');
  process.exit(0);
});

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
