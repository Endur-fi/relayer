// import { type PrismaClient } from "../../generated/client/index.d.ts";
// import { createRequire } from "node:module";
// const require = createRequire(import.meta.url);
// const Prisma = require("./src/generated/client/index.js");

import { prisma, PrismaClient } from "../../prisma/client.ts";

interface IPrismaService {
  getDepositsLastDay(): Promise<bigint>;
  // getWithdrawalsLastDay(): bigint;
}

export class PrismaService implements IPrismaService {
  prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async getDepositsLastDay() {
    const dep = await this.prisma.deposits.findFirst();
    console.log("hello", dep);
    return BigInt(1);
  }
}
