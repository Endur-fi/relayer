import * as dotenv from "dotenv";
dotenv.config();

import { REFERRERS_WITH_CODE } from "../../common/constants";
import { logger } from "../../common/utils";
import { ReferralBonusService } from "../services/referral-bonus.service";

/**
 * Standalone script to execute Referral Bonus calculation
 * Usage: node referral-bonus-script.ts [--dry-run] [--summary-only]
 */

const ReferrersToIgnore = REFERRERS_WITH_CODE;

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const summaryOnly = args.includes("--summary-only");

  const referralBonusService = new ReferralBonusService();

  try {
    logger.info("=".repeat(80));
    logger.info("REFERRAL BONUS CALCULATION SCRIPT");
    logger.info("=".repeat(80));

    if (isDryRun) {
      logger.info("🔍 DRY RUN MODE - No changes will be made to the database");
    }

    logger.info(`📋 Ignoring referrers: ${ReferrersToIgnore.join(", ")}`);

    // always show summary first
    logger.info("📊 Getting Referral Bonus Summary...");
    const summary =
      await referralBonusService.getReferralBonusSummary(ReferrersToIgnore);

    logger.info("📈 REFERRAL BONUS SUMMARY");
    logger.info("-".repeat(50));
    logger.info(`Total Eligible Referees: ${summary.totalEligibleReferees}`);
    logger.info(`Total Current Points: ${summary.totalCurrentPoints}`);
    logger.info(`Total Bonus To Be Awarded: ${summary.totalBonusToBeAwarded}`);
    logger.info(`Bonus Percentage: 100% (doubling)`);
    logger.info(
      `Users Already With Priority Bonus: ${summary.usersWithExistingPriorityBonus}`
    );
    logger.info("-".repeat(50));

    if (summary.eligibleUsers.length > 0) {
      logger.info("📋 Sample of eligible users:");
      summary.eligibleUsers.slice(0, 5).forEach((user, index) => {
        logger.info(
          `  ${index + 1}. ${user.user_address}: ${user.total_points} points → +${user.bonus_points} bonus`
        );
      });
      if (summary.eligibleUsers.length > 5) {
        logger.info(`  ... and ${summary.eligibleUsers.length - 5} more users`);
      }
    }

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

      logger.info("🚀 Proceeding with Referral Bonus calculation...");

      // execute the bonus calculation
      const result =
        await referralBonusService.calculateAndAwardReferralBonus(
          ReferrersToIgnore
        );

      logger.info("✅ Referral Bonus calculation completed!");
      logger.info(`📊 Results:`);
      logger.info(`  - Users processed: ${result.usersProcessed}`);
      logger.info(
        `  - Total bonus points awarded: ${result.totalBonusAwarded}`
      );
      logger.info(
        `  - Users skipped (already had priority bonus): ${result.usersSkipped}`
      );

      // validate the results
      logger.info("🔍 Validating referral bonus calculation...");
      const validation =
        await referralBonusService.validateReferralBonusCalculation(
          ReferrersToIgnore
        );

      if (validation.isValid) {
        logger.info(
          "✅ Validation successful! All referral bonus calculations are correct."
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
      logger.info("🔍 DRY RUN: Would execute Referral Bonus calculation");
      logger.info(
        `🔍 DRY RUN: Would process ${summary.totalEligibleReferees} users`
      );
      logger.info(
        `🔍 DRY RUN: Would award ${summary.totalBonusToBeAwarded} total bonus points`
      );
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
