import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import '@nestjs/platform-express';
import * as dotenv from 'dotenv';

import { BonusController } from './controllers/user-bonus.controller';
import { PointsSystemService } from './services/points-system.service';
import { BonusService } from './services/user-bonus.service';

dotenv.config();

@Module({
  // imports: [ScheduleModule.forRoot()],
  imports: [],
  providers: [PointsSystemService, BonusService],
  controllers: [
    BonusController,
    // StatusController,
    // PrismaController,
    // LstController,
    // WqController,
  ],
})
class AppModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // get the service instance
    const pointsSystemService = app.get(PointsSystemService);

    pointsSystemService.setConfig({
      startDate: new Date('2024-11-24'),
      endDate: new Date(),
    });
    await pointsSystemService.fetchAndStoreHoldings();

    await app.listen(process.env.RELAYER_PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);

    console.log('Early User Bonus endpoints available:');
    console.log('- GET /early-user/summary - Get eligibility summary');
    console.log('- POST /early-user/execute - Execute bonus calculation');
    console.log('- GET /early-user/validate - Validate bonus calculation');

    console.log('\nSix Month Bonus endpoints available:');
    console.log('- GET /six-month/summary - Get eligibility summary');
    console.log('- POST /six-month/execute - Execute bonus calculation');
    console.log('- GET /six-month/validate - Validate bonus calculation');
    console.log('- GET /six-month/user/:address - Get user breakdown');
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}

bootstrap();
