import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import "@nestjs/platform-express";
import { AppController } from "./controllers/app.controller.ts";
import { PrismaService } from "./services/prismaService.ts";
import { PrismaController } from "./controllers/prisma.controller.ts";

@Module({
  providers: [PrismaService],
  controllers: [AppController, PrismaController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Deno.env.get("PORT") ?? 3000);
}
bootstrap();
