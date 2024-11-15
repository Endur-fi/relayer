import { PrismaClient } from "@prisma/client";

interface IPrismaService {
  getDepositsLastDay(): Promise<bigint>;
  // getWithdrawalsLastDay(): bigint;
}

export class PrismaService implements IPrismaService {
  readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getDepositsLastDay() {
    const dep = await this.prisma.deposits.findFirst();
    console.log("hello", dep);
    return BigInt(1);
  }
}
