import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

import {
  calculatePoints,
  fetchAndStoreHoldings,
  fetchHoldingsWithRetry,
  processTaskBatch,
  updatePointsAggregated,
} from "../points-system/index";

const prisma = new PrismaClient();

// At the top of your test file or in a setup file
jest.mock("../points-system/index", () => {
  const original = jest.requireActual("../points-system/index");

  return {
    ...(original as object),
    RETRY_DELAY: 100, // Reduce retry delay to 100ms for tests
    MAX_RETRIES: 3,
  };
});

function interpolateBlockTime(
  blockNumber: number,
  startBlock: number,
  startTime: number,
  endBlock: number,
  endTime: number
): number {
  const timePerBlock = (endTime - startTime) / (endBlock - startBlock);
  const blockDiff = blockNumber - startBlock;
  return Math.floor(startTime + blockDiff * timePerBlock);
}

describe("Holdings and Points Calculator Tests", () => {
  const startBlock = 929096; // xSTRK deployment block
  const startTime = 1732529278; // unix timestamp of 929096
  const endBlock = 1097865; // block on Jan 26th, 2025
  const endTime = 1737830887; // unix timestamp of 1097865

  // sample user addresses
  const testUsers = [
    "0x3495dd1e4838aa06666aac236036d86e81a6553e222fc02e70c2cbc0062e8d0",
    "0x6bf0f343605525d3aea70b55160e42505b0ac567b04fd9fc3d2d42fdcd2ee45",
    "0x15271d7af39a8c637cdad165b90ae2278f9ac836fa57a2cdde3da81f5fd45c8",
    "0x55741fd3ec832f7b9500e24a885b8729f213357be4a8e209c4bca1f3b909ae",
    "0x5de88d79a1b46c483f3d35354441cd4e8f06384de977761e61db4858dda5156",
  ];

  // mock dates for testing
  const testDates = [
    new Date("2024-11-25"),
    new Date("2024-11-26"),
    new Date("2024-11-27"),
  ];

  // sample holdings response
  const mockHoldingsResponse = {
    blocks: [{ block: "500000" }],
    vesu: [
      {
        xSTRKAmount: {
          bigNumber: "10000000000000000000", // 10 with 18 decimals
          decimals: 18,
        },
      },
    ],
    ekubo: [
      {
        xSTRKAmount: {
          bigNumber: "5000000000000000000", // 5 with 18 decimals
          decimals: 18,
        },
      },
    ],
    nostraLending: [
      {
        xSTRKAmount: {
          bigNumber: "7000000000000000000", // 7 with 18 decimals
          decimals: 18,
        },
      },
    ],
    nostraDex: [
      {
        xSTRKAmount: {
          bigNumber: "3000000000000000000", // 3 with 18 decimals
          decimals: 18,
        },
      },
    ],
    wallet: [
      {
        xSTRKAmount: {
          bigNumber: "1000000000000000000", // 1 with 18 decimals
          decimals: 18,
        },
      },
    ],
    strkfarm: [
      {
        xSTRKAmount: {
          bigNumber: "4000000000000000000", // 4 with 18 decimals
          decimals: 18,
        },
      },
    ],
  };

  // reset the database before all tests
  beforeAll(async () => {
    // clear tables in the correct order to avoid foreign key constraints
    await prisma.points_aggregated.deleteMany({});
    await prisma.user_points.deleteMany({});
    await prisma.user_balances.deleteMany({});
    await prisma.users.deleteMany({});
    await prisma.blocks.deleteMany({});

    const mockBlocks = [];
    const daysToCover = 30; // cover a full month
    for (let i = 0; i < daysToCover; i++) {
      const blockNumber = startBlock + i * 1000;
      const timestamp = startTime + i * 86400; // add one day per block
      mockBlocks.push({ block_number: blockNumber, timestamp });
    }

    await prisma.blocks.createMany({ data: mockBlocks });

    // insert test users
    await prisma.users.createMany({
      data: testUsers.map((address) => ({
        user_address: address,
        block_number: startBlock + 10000, // some arbitrary block
        tx_index: 0,
        event_index: 0,
        tx_hash: `0x${address.substring(2, 10)}`, // generate some fake tx hash
        timestamp: startTime + 86400, // one day after deployment
      })),
    });

    console.log("Database reset and mock data inserted successfully");
  });

  // clean up after all tests
  afterAll(async () => {
    // add a small delay to ensure all async operations complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await prisma.$disconnect();
  });

  // reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.points_aggregated.deleteMany(),
      prisma.user_balances.deleteMany(),
    ]);
    jest.clearAllMocks();
  });

  describe("Mock Block Times", () => {
    it("should correctly interpolate block times", () => {
      // Test the interpolation function
      const midBlock = (startBlock + endBlock) / 2;
      const expectedTime = (startTime + endTime) / 2;
      const calculatedTime = interpolateBlockTime(
        midBlock,
        startBlock,
        startTime,
        endBlock,
        endTime
      );

      expect(calculatedTime).toBeCloseTo(expectedTime, -2); // Allow some rounding
    });

    it("should find correct block for a given date", async () => {
      // test date - somewhere in the middle of our test range
      const testDate = new Date("2024-12-01");
      const testTimestamp = Math.floor(testDate.getTime() / 1000);

      // Increase the leeway significantly since our mock blocks are spaced far apart
      const blockInfo = await prisma.blocks.findFirst({
        where: {
          timestamp: {
            lte: testTimestamp + 86400 * 3, // 3 days after
            gte: testTimestamp - 86400 * 3, // 3 days before
          },
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      expect(blockInfo).not.toBeNull();
    });
  });

  describe("fetchHoldingsWithRetry", () => {
    beforeEach(() => {
      // Mock the block lookup
      jest.spyOn(prisma.blocks, "findFirst").mockResolvedValue({
        block_number: 500000,
        timestamp: 1732600000,
        cursor: 0 as unknown as bigint,
      });
    });

    it("should handle API errors and retry", async () => {
      // first call fails, second succeeds
      mockedAxios.get
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({ data: mockHoldingsResponse });

      const result = await fetchHoldingsWithRetry(testUsers[0], testDates[0]);

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(result).not.toBeNull();
    }, 10000); // 10 second timeout

    it("should return null after max retries", async () => {
      // all calls fail
      mockedAxios.get.mockRejectedValue(new Error("API Error"));

      const result = await fetchHoldingsWithRetry(testUsers[0], testDates[0]);

      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });
  });

  describe("calculatePoints", () => {
    it("should correctly calculate points from total amount", () => {
      const points = calculatePoints("30");
      expect(points).toBe(BigInt(30)); // 2ith multiplier of 1
    });

    it("should handle decimal amounts", () => {
      const points = calculatePoints("12.34");
      expect(points).toBe(BigInt(12)); // should floor the decimal
    });

    it("should handle zero amount", () => {
      const points = calculatePoints("0");
      expect(points).toBe(BigInt(0));
    });
  });

  describe("updatePointsAggregated", () => {
    it("should create a new points record if none exists", async () => {
      // mock user balance
      const mockBalance = {
        user_address: testUsers[0],
        block_number: 500000,
        timestamp: interpolateBlockTime(
          500000,
          startBlock,
          startTime,
          endBlock,
          endTime
        ),
        total_amount: "30",
        vesuAmount: "10",
        ekuboAmount: "5",
        nostraLendingAmount: "7",
        nostraDexAmount: "3",
        walletAmount: "1",
        strkfarmAmount: "4",
        date: testDates[0].toISOString().split("T")[0],
      };

      // Ensure no record exists
      await prisma.points_aggregated.deleteMany({
        where: { user_address: testUsers[0] },
      });

      await updatePointsAggregated(mockBalance);

      const record = await prisma.points_aggregated.findUnique({
        where: { user_address: testUsers[0] },
      });

      expect(record).not.toBeNull();
      expect(record).toHaveProperty("total_points", BigInt(30));
    });

    it("should update an existing points record", async () => {
      // create an initial record
      await prisma.points_aggregated.upsert({
        where: { user_address: testUsers[1] },
        create: {
          user_address: testUsers[1],
          total_points: BigInt(10),
          block_number: 450000,
          timestamp: interpolateBlockTime(
            450000,
            startBlock,
            startTime,
            endBlock,
            endTime
          ),
        },
        update: {},
      });

      // mock user balance with higher block number
      const mockBalance = {
        user_address: testUsers[1],
        block_number: 550000,
        timestamp: interpolateBlockTime(
          550000,
          startBlock,
          startTime,
          endBlock,
          endTime
        ),
        total_amount: "40",
        vesuAmount: "15",
        ekuboAmount: "8",
        nostraLendingAmount: "7",
        nostraDexAmount: "5",
        walletAmount: "2",
        strkfarmAmount: "3",
        date: testDates[1].toISOString().split("T")[0],
      };

      await updatePointsAggregated(mockBalance);

      const record = await prisma.points_aggregated.findUnique({
        where: { user_address: testUsers[1] },
      });

      expect(record).toHaveProperty("total_points", BigInt(40));
      expect(record).toHaveProperty("block_number", 550000);
    });
  });

  describe("processTaskBatch", () => {
    beforeEach(() => {
      // Mock successful API response
      mockedAxios.get.mockResolvedValue({ data: mockHoldingsResponse });

      // Mock block lookup
      jest.spyOn(prisma.blocks, "findFirst").mockResolvedValue({
        block_number: 500000,
        timestamp: 1732600000,
        cursor: 0 as unknown as bigint,
      });
    });

    it("should process a batch of tasks", async () => {
      const tasks: [string, Date][] = [
        [testUsers[0], testDates[0]],
        [testUsers[1], testDates[1]],
      ];

      const result = await processTaskBatch(tasks);
      expect(result).toBe(2); // Both should succeed

      // Verify records were created
      const records = await prisma.user_balances.findMany();
      expect(records.length).toBe(2);
    });
  });

  describe("Integration Test", () => {
    beforeEach(() => {
      // Mock getAllTasks
      jest
        .spyOn(require("../points-system/index"), "getAllTasks")
        .mockResolvedValue([
          [testUsers[0], testDates[0]],
          [testUsers[1], testDates[1]],
        ]);

      // Mock successful API response
      mockedAxios.get.mockResolvedValue({ data: mockHoldingsResponse });

      // Mock block lookup
      jest.spyOn(prisma.blocks, "findFirst").mockResolvedValue({
        block_number: 500000,
        timestamp: 1732600000,
        cursor: 0 as unknown as bigint,
      });
    });

    it("should run the full holdings fetch process", async () => {
      await fetchAndStoreHoldings();

      // verify records were created
      const count = await prisma.user_balances.count();
      expect(count).toBe(2);

      // verify points were aggregated
      const pointsCount = await prisma.points_aggregated.count();
      expect(pointsCount).toBe(2);
    });
  });
});
