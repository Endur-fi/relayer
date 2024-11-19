import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import "@nestjs/platform-express";
import { StatusController } from "./controllers/status.controller.ts";
import { PrismaService } from "./services/prismaService.ts";
import { PrismaController } from "./controllers/prisma.controller.ts";
import { LstController } from "./controllers/admin.controller.ts";
import { LSTService } from "./services/lstService.ts";
import { ConfigService } from "./services/configService.ts";

@Module({
  providers: [PrismaService, LSTService, ConfigService],
  controllers: [StatusController, PrismaController, LstController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Deno.env.get("PORT") ?? 3000);
}
bootstrap();
