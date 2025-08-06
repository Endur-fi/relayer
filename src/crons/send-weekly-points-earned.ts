import { Logger } from "@nestjs/common";

import { BotService } from "../common/services/bot.service";
import { WeeklyPointsService } from "../points-system/services/weekly-points.service";

/**
 * Standalone script to send weekly points earned to all users
 * Runs immediately when executed
 */
async function sendWeeklyPointsEarned(): Promise<void> {
  const logger = new Logger("SendWeeklyPointsEarnedScript");

  logger.log("Starting weekly points earned distribution script...");

  try {
    // Initialize services
    const botService = new BotService();
    const weeklyPointsService = new WeeklyPointsService(botService);

    // Process weekly points for all users
    await weeklyPointsService.processWeeklyPointsForAllUsers();

    logger.log("Weekly points earned distribution completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Error in weekly points earned distribution:", error);
    process.exit(1);
  }
}

// Run the script immediately
if (require.main === module) {
  sendWeeklyPointsEarned();
}
