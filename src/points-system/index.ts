import * as dotenv from "dotenv";
dotenv.config();

import { DexScoreService } from "./services/dex-points.service";
import { PointsCronService } from "./services/points-cron.service";
import { PointsSystemService } from "./services/points-system.service";
import { BonusService } from "./services/user-bonus.service";
import { WeeklyPointsService } from "./services/weekly-points.service";
import { BotService } from "../common/services/bot.service";

async function runPointsInit() {
  try {
    console.log("Initializing points system services...");

    // Instantiate services (without NestJS dependency injection)
    const botService = new BotService();
    const dexScoreService = new DexScoreService();
    const pointsSystemService = new PointsSystemService(dexScoreService);
    const weeklyPointsService = new WeeklyPointsService(pointsSystemService, botService);

    // Create PointsCronService with dependencies
    const pointsCronService = new PointsCronService(
      dexScoreService,
      pointsSystemService,
      weeklyPointsService
    );

    console.log("Running points initialization...");

    // Call the init function directly
    await pointsCronService.onModuleInit();

    console.log("Points initialization completed successfully!");
  } catch (error) {
    console.error("Error running points initialization:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  runPointsInit();
}
