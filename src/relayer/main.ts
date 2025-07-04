import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';

import * as dotenv from 'dotenv';
dotenv.config();

import { BotService } from '../common/services/bot.service';
import { LstController } from './controllers/lst.controller';
import { PrismaController } from './controllers/prisma.controller';
import { StatusController } from './controllers/status.controller';
import { WqController } from './controllers/wq.controller';
import { CronService } from './cron.service';
import { ConfigService } from './services/configService';
import { DelegatorService } from './services/delegatorService';
import { LSTService } from './services/lstService';
import { NotifService } from './services/notifService';
import { PrismaService } from './services/prismaService';
import { WithdrawalQueueService } from './services/withdrawalQueueService';

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
    CronService,
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
    await app.listen(process.env.RELAYER_PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();
