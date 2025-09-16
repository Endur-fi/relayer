import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "@nestjs/platform-express";
import { ScheduleModule } from "@nestjs/schedule";
import * as dotenv from "dotenv";
dotenv.config();

import { CronService } from "./cron.service";

import { StatusController } from "./controllers/status.controller";
import { ConfigService } from "./services/configService";
import { DelegatorService } from "./services/delegatorService";
import { LSTService } from "./services/lstService";
import { NotifService } from "./services/notifService";
import { PrismaService } from "./services/prismaService";
import { WithdrawalQueueService } from "./services/withdrawalQueueService";
import { BotService } from "../common/services/bot.service";
import { ValidatorRegistryService } from "./services/validatorRegistryService";
import { RPCWrapper } from "./services/RPCWrapper";

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
    ValidatorRegistryService,
    RPCWrapper,
    CronService,
  ],
  controllers: [
    StatusController,
  ],
})
class AppModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.RELAYER_PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error("Error starting the application:", error);
  }
}
bootstrap();
