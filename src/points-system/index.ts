import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "@nestjs/platform-express";
import { ScheduleModule } from "@nestjs/schedule";
import * as dotenv from "dotenv";
dotenv.config();

import { BonusController } from "./controllers/user-bonus.controller";
import { DexScoreService } from "./services/dex-points.service";
import { PointsCronService } from "./services/points-cron.service";
import { PointsSystemService } from "./services/points-system.service";
import { BonusService } from "./services/user-bonus.service";
import { WeeklyPointsService } from "./services/weekly-points.service";
import { BotService } from "../common/services/bot.service";
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    DexScoreService,
    PointsSystemService,
    BonusService,
    PointsCronService,
    WeeklyPointsService,
    BotService,
  ],
  controllers: [BonusController],
})
class AppModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 4000);
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
}

bootstrap();
