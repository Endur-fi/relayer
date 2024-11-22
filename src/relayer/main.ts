import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import "@nestjs/platform-express";
import { StatusController } from "./controllers/status.controller.ts";
import { PrismaService } from "./services/prismaService.ts";
import { PrismaController } from "./controllers/prisma.controller.ts";
import { LstController } from "./controllers/lst.controller.ts";
import { LSTService } from "./services/lstService.ts";
import { ConfigService } from "./services/configService.ts";
import { WqController } from "./controllers/wq.controller.ts";
import { WithdrawalQueueService } from "./services/withdrawalQueueService.ts";
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from "./cron.service.ts";
import "npm:reflect-metadata";
import { NotifService } from "./services/notifService.ts";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PrismaService, LSTService, ConfigService, WithdrawalQueueService, CronService, NotifService],
  controllers: [
    StatusController,
    PrismaController,
    LstController,
    WqController 
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Deno.env.get("PORT") ?? 3000);
}
bootstrap();


// // deps.ts
// import { NestFactory } from "npm:@nestjs/core";
// import { Module, Injectable } from "npm:@nestjs/common";
// import { ScheduleModule } from "npm:@nestjs/schedule";

// // main.ts
// import "npm:reflect-metadata";

// @Module({
//   imports: [
//     ScheduleModule.forRoot({
//       enable: true,
//     }),
//   ],
//   providers: [],
// })
// export class AppModule {}

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.init();
// }

// bootstrap();