import * as dotenv from "dotenv";
dotenv.config();

import { logger } from "../../common/utils";
import {
  BonusService,
  EARLY_USER_BONUS_PERCENTAGE,
} from "../services/user-bonus.service";

/**
 * Standalone script to execute Early User Bonus calculation
 * Usage: node early-user-bonus-script.js [--dry-run] [--summary-only]
 * --dry-run: Run in dry mode, no changes will be made to the database
 * --summary-only: Only show the summary and exit, no calculations will be performed
 *
 * @dev This script calculates the Early User Bonus based on the points system.
 * Its is a one time incentive designed to reward early adopters
 */

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const summaryOnly = args.includes("--summary-only");

  const bonusService = new BonusService();

  try {
    logger.info("=".repeat(80));
    logger.info("EARLY USER BONUS CALCULATION SCRIPT");
    logger.info("=".repeat(80));

    if (isDryRun) {
      logger.info("🔍 DRY RUN MODE - No changes will be made to the database");
    }

    // always show summary first
    logger.info("📊 Getting Early User Bonus Summary...");
    const summary = await bonusService.getEarlyUserBonusSummary();

    logger.info("📈 EARLY USER BONUS SUMMARY");
    logger.info("-".repeat(50));
    logger.info(`Cutoff Date: ${summary.cutoffDate.toISOString()}`);
    logger.info(`Total Eligible Users: ${summary.totalEligibleUsers}`);
    logger.info(
      `Total Points Before Cutoff: ${summary.totalPointsBeforeCutoff}`
    );
    logger.info(`Total Bonus To Be Awarded: ${summary.totalBonusToBeAwarded}`);
    logger.info(`Bonus Percentage: 20%`);
    logger.info("-".repeat(50));

    if (summaryOnly) {
      logger.info("✅ Summary complete. Exiting (summary-only mode).");
      return;
    }

    if (!isDryRun) {
      // confirmation prompt
      logger.info("⚠️  WARNING: This will permanently modify the database!");
      logger.info(
        "Are you sure you want to proceed? (This script will continue in 10 seconds...)"
      );

      // wait 10 seconds for manual intervention
      await new Promise((resolve) => setTimeout(resolve, 10000));

      logger.info("🚀 Proceeding with Early User Bonus calculation...");

      // execute the bonus calculation
      await bonusService.calculateAndAwardEarlyUserBonus();

      // validate the results
      logger.info("🔍 Validating bonus calculation...");
      // ! Ensure correct value is set for EARLY_USER_BONUS_PERCENTAGE
      const validation = await bonusService.validateEarlyUserBonusCalculation(
        EARLY_USER_BONUS_PERCENTAGE / 100
      );

      if (validation.isValid) {
        logger.info(
          "✅ Validation successful! All bonus calculations are correct."
        );
      } else {
        logger.error(
          `❌ Validation failed! Found ${validation.discrepancies.length} discrepancies:`
        );
        validation.discrepancies.slice(0, 10).forEach((d) => {
          logger.error(
            `  User: ${d.user_address}, Expected: ${d.expected}, Actual: ${d.actual}, Diff: ${d.difference}`
          );
        });
        if (validation.discrepancies.length > 10) {
          logger.error(
            `  ... and ${validation.discrepancies.length - 10} more`
          );
        }
      }
    } else {
      logger.info("🔍 DRY RUN: Would execute Early User Bonus calculation");
      logger.info("🔍 DRY RUN: Would validate results");
    }

    logger.info("=".repeat(80));
    logger.info("✅ Script completed successfully!");
    logger.info("=".repeat(80));
  } catch (error) {
    logger.error("❌ Script failed with error:", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  logger.info("\n⚠️  Script interrupted by user. Exiting...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("\n⚠️  Script terminated. Exiting...");
  process.exit(0);
});

main().catch((error) => {
  logger.error("Unhandled error:", error);
  process.exit(1);
});
