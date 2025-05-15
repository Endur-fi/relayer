import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import "@nestjs/platform-express";
import { PointsSystemService } from './points-system.service';

@Module({
  // imports: [ScheduleModule.forRoot()],
  imports: [],
  providers: [
    PointsSystemService
  ],
  controllers: [
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
    await app.listen(process.env.RELAYER_PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();
