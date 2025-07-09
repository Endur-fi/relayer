import { Logger } from "@nestjs/common";
import { WeeklyPointsService } from "../points-system/services/weekly-points.service";
import { BotService } from "../common/services/bot.service";

/**
 * Standalone script to send weekly points earned to all users
 * Runs immediately when executed
 */
async function takeWeeklyPointsSnapshot(): Promise<void> {
  const logger = new Logger('takeWeeklyPointsSnapshot');
  
  logger.log('Starting weekly points snapshot process...');
  
  try {
    // Initialize services
    const botService = new BotService();
    const weeklyPointsService = new WeeklyPointsService(botService);
    
    // Process weekly points for all users
    await weeklyPointsService.weeklyPointsSnapshot();
    
    logger.log('Weekly points snapshot completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error in weekly points snapshot:', error);
    process.exit(1);
  }
}

// Run the script immediately
if (require.main === module) {
  takeWeeklyPointsSnapshot();
}