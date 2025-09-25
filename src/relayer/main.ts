import * as dotenv from "dotenv";
dotenv.config();

import { MonitoringSDK } from "@hemantwasthere/monitoring-sdk";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR, NestFactory } from "@nestjs/core";
import "@nestjs/platform-express";
import { ScheduleModule } from "@nestjs/schedule";

import { CronService } from "./cron.service";

import { BotService } from "../common/services/bot.service";
import { WeeklyPointsService } from "../points-system/services/weekly-points.service";
import { StatusController } from "./controllers/status.controller";
import { ConfigService } from "./services/configService";
import { DelegatorService } from "./services/delegatorService";
import { LSTService } from "./services/lstService";
import { NotifService } from "./services/notifService";
import { PrismaService } from "./services/prismaService";
import { WithdrawalQueueService } from "./services/withdrawalQueueService";

const monitoring = MonitoringSDK.initialize({
  projectName: "Relayer",
  serviceName: "relayer-service",
  technology: "nestjs",
  prefixAllMetrics: true,
  enableDefaultMetrics: true,
});

const logger = monitoring.getLogger();
const { MonitoringInterceptor } = monitoring.getMiddleware();

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    PrismaService,
    ConfigService,
    LSTService,
    WithdrawalQueueService,
    DelegatorService,
    NotifService,
    BotService,
    WeeklyPointsService,
    CronService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MonitoringInterceptor,
    },
  ],
  controllers: [
    StatusController,
    // PrismaController,
    // LstController,
    // WqController,
  ],
})
class AppModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Add metrics endpoint
    app
      .getHttpAdapter()
      .get("/metrics", async (_req: unknown, res: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = res as any;
        response.setHeader(
          "Content-Type",
          monitoring.getMetrics().getRegistry().contentType
        );
        const metrics = await monitoring.getMetrics().getMetrics();
        response.send(metrics);
      });

    await app.listen(process.env.RELAYER_PORT ?? 3000);

    const url = await app.getUrl();
    logger.info(`Application is running on: ${url}`);
  } catch (error) {
    logger.error("Error starting the application:", error);
  }
}
bootstrap();
