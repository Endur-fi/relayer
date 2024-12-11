import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import "@nestjs/platform-express";
import { StatusController } from "./controllers/status.controller";
import { PrismaService } from "./services/prismaService";
import { PrismaController } from "./controllers/prisma.controller";
import { LstController } from "./controllers/lst.controller";
import { LSTService } from "./services/lstService";
import { ConfigService } from "./services/configService";
import { WqController } from "./controllers/wq.controller";
import { WithdrawalQueueService } from "./services/withdrawalQueueService";
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from "./cron.service";
import { NotifService } from "./services/notifService";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PrismaService, ConfigService, LSTService, WithdrawalQueueService, NotifService, CronService],
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
    await app.listen(process.env.RELAYER_PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();
