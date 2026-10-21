import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "@nestjs/platform-express";
import { ScheduleModule } from "@nestjs/schedule";
import * as dotenv from "dotenv";
dotenv.config();

import { StatusController } from "./controllers/status.controller";
import { RELAYER_PROVIDERS } from "./providers";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: RELAYER_PROVIDERS,
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
