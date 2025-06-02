import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import '@nestjs/platform-express';
import * as dotenv from 'dotenv';

import { BonusController } from './controllers/user-bonus.controller';
import { UsersController } from './controllers/users.controller';
import { PointsSystemService } from './services/points-system.service';
import { BonusService } from './services/user-bonus.service';
import { UsersService } from './services/users.service';
import { connectPrisma } from './utils';

dotenv.config();

@Module({
  imports: [],
  providers: [PointsSystemService, BonusService, UsersService],
  controllers: [BonusController, UsersController],
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
      startDate: new Date('2024-11-24'),
      endDate: new Date(),
    });

    await app.listen(process.env.RELAYER_PORT ?? 4000);
    console.log(`Application is running on: ${await app.getUrl()}`);

    console.log('Available users endpoints:');
    console.log('- GET /users - Get all users with details');
    console.log('- GET /users/:address - Get user details by address');
    console.log('- GET /users/:address/points - Get user points by address');
    console.log('- GET /users/:address/eligibility - Check user eligibility for bonuses');
    console.log('- GET /users/:address/balances - Get user balances by address');
    console.log('- GET /users/stats/overview - Get user stats overview');

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
