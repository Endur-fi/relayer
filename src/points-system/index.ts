import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import '@nestjs/platform-express';
import * as dotenv from 'dotenv';

import { BonusController } from './controllers/user-bonus.controller';
import { PointsSystemService } from './services/points-system.service';
import { BonusService } from './services/user-bonus.service';
import { connectPrisma } from './utils';

dotenv.config();

@Module({
  imports: [],
  providers: [PointsSystemService, BonusService],
  controllers: [BonusController],
})
class AppModule {}

async function bootstrap() {
  try {
    await connectPrisma();

    const app = await NestFactory.create(AppModule);

    app.enableShutdownHooks();

    // enable CORS for all origins
    app.enableCors();

    const pointsSystemService = app.get(PointsSystemService);

    // configure cron at 12am
    const now = new Date();
    now.setDate(now.getDate() - 1); // run until previous datw
    pointsSystemService.setConfig({
      startDate: new Date('2024-11-25'),
      endDate: new Date('2025-05-25'),
    });

    await pointsSystemService.fetchAndStoreHoldings();
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
