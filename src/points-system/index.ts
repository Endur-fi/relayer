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

    pointsSystemService.setConfig({
      startDate: new Date('2024-11-25'),
      endDate: new Date('2025-05-25'),
    });

    await app.listen(process.env.RELAYER_PORT ?? 4000);
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

    // await pointsSystemService.fetchAndStoreHoldings();
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
