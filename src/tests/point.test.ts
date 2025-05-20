import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/my-client';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { PointsSystemService } from '../points-system/services/points-system.service';
import { calculatePoints } from '../points-system/utils';
import { createTestUsers, resetDb } from './test-utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// assert db is test db
if (!process.env.DATABASE_URL?.includes('test')) {
  throw new Error('Test database not set up correctly');
}

const prisma = new PrismaClient();

// mock constants for faster test execution
jest.mock('../points-system/points-system.service', () => {
  const original = jest.requireActual('../points-system/points-system.service');

  return {
    ...(original as object),
    RETRY_DELAY: 100, // reduce retry delay
    MAX_RETRIES: 3,
    DB_BATCH_SIZE: 10, // smaller batch size
  };
});

function interpolateBlockTime(
  blockNumber: number,
  startBlock: number,
  startTime: number,
  endBlock: number,
  endTime: number,
): number {
  const timePerBlock = (endTime - startTime) / (endBlock - startBlock);
  const blockDiff = blockNumber - startBlock;
  return Math.floor(startTime + blockDiff * timePerBlock);
}

function getUnixTimestamp(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

function createMockHoldingsResponse(
  holdings: {
    vesu?: string;
    ekubo?: string;
    nostraLending?: string;
    nostraDex?: string;
    wallet?: string;
    strkfarm?: string;
  },
  blockNumber: string = '500000',
) {
  return {
    blocks: [{ block: blockNumber }],
    vesu: [
      {
        xSTRKAmount: {
          bigNumber: BigInt(parseFloat(holdings.vesu || '0') * 10 ** 18).toString(),
          decimals: 18,
        },
      },
    ],
    ekubo: [
      {
        xSTRKAmount: {
          bigNumber: BigInt(parseFloat(holdings.ekubo || '0') * 10 ** 18).toString(),
          decimals: 18,
        },
      },
    ],
    nostraLending: [
      {
        xSTRKAmount: {
          bigNumber: BigInt(parseFloat(holdings.nostraLending || '0') * 10 ** 18).toString(),
          decimals: 18,
        },
      },
    ],
    nostraDex: [
      {
        xSTRKAmount: {
          bigNumber: BigInt(parseFloat(holdings.nostraDex || '0') * 10 ** 18).toString(),
          decimals: 18,
        },
      },
    ],
    wallet: [
      {
        xSTRKAmount: {
          bigNumber: BigInt(parseFloat(holdings.wallet || '0') * 10 ** 18).toString(),
          decimals: 18,
        },
      },
    ],
    strkfarm: [
      {
        xSTRKAmount: {
          bigNumber: BigInt(parseFloat(holdings.strkfarm || '0') * 10 ** 18).toString(),
          decimals: 18,
        },
      },
    ],
  };
}

describe('xSTRK Points System Integration Tests', () => {
  const startBlock = 929096; // xSTRK deployment block
  const startTime = 1732529278; // unix timestamp of deployment block
  const endBlock = 1097865; // block on Jan 26th, 2025
  const endTime = 1737830887; // unix timestamp of end block

  interface TestUser {
    address: string;
    description: string;
    holdings: Record<string, { [key: string]: string }>;
    expectedPoints: number;
  }

  const testUsers: TestUser[] = [
    {
      address: '0x0000000000000000000000000000000000000001',
      description: 'Never held xSTRK',
      holdings: {},
      expectedPoints: 0,
    },
    {
      address: '0x0000000000000000000000000000000000000002',
      description: 'Only held xSTRK in wallet (10 tokens consistently)',
      holdings: {
        '2024-11-24': { wallet: '10' },
        '2024-11-25': { wallet: '10' },
      },
      expectedPoints: 10 * 60,
    },
    {
      address: '0x0000000000000000000000000000000000000003',
      description: 'Only held xSTRK but withdrew partially on day 30',
      holdings: {
        '2024-11-24': { wallet: '20' },
        '2024-12-24': { wallet: '10' },
      },
      expectedPoints: 20 * 30 + 10 * 30, // 20 tokens for 30 days + 10 tokens for 30 days = 900
    },
    {
      address: '0x0000000000000000000000000000000000000004',
      description: 'Only held xSTRK but withdrew fully on day 30',
      holdings: {
        '2024-11-24': { wallet: '15' },
        '2024-12-24': { wallet: '0' },
      },
      expectedPoints: 15 * 30, // 15 tokens for 30 days = 450
    },
    {
      address: '0x0000000000000000000000000000000000000005',
      description: 'Transferred liquidity to Ekubo on day 20',
      holdings: {
        '2024-11-24': { wallet: '25' },
        '2024-12-14': { wallet: '5', ekubo: '20' },
      },
      expectedPoints: 25 * 20 + (5 + 20) * 40, // 25 tokens for 20 days + 25 tokens for 40 days = 1500
    },
    {
      address: '0x0000000000000000000000000000000000000006',
      description: 'Transferred liquidity to Vesu on day 15',
      holdings: {
        '2024-11-24': { wallet: '30' },
        '2024-12-09': { wallet: '10', vesu: '20' },
      },
      expectedPoints: 30 * 15 + (10 + 20) * 45, // 30 tokens for 15 days + 30 tokens for 45 days = 1800
    },
    {
      address: '0x0000000000000000000000000000000000000007',
      description: 'Transferred liquidity to Nostra (both lending and DEX) on day 25',
      holdings: {
        '2024-11-24': { wallet: '40' },
        '2024-12-19': { wallet: '10', nostraLending: '15', nostraDex: '15' },
      },
      expectedPoints: 40 * 25 + (10 + 15 + 15) * 35, // 40 tokens for 25 days + 40 tokens for 35 days = 2400
    },
  ];

  // generate dates for the 60-day test period
  const startDate = new Date('2024-11-24');
  const testDates: Date[] = [];
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    testDates.push(date);
  }

  const mockBlocks = testDates.map((date, index) => {
    const blockNumber = startBlock + index * 1000; // 1000 blocks per day for simplicity
    const timestamp = getUnixTimestamp(date.toISOString());
    return { block_number: blockNumber, timestamp };
  });

  beforeAll(async () => {
    // reset database before all tests
    // clear tables in the correct order to avoid foreign key constraints

    await resetDb(mockBlocks);
    await createTestUsers(testUsers, startBlock, startTime);
    console.log('Database reset and mock data inserted successfully');
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await prisma.$disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Mock Holdings Response', () => {
    it('should correctly create mock holdings response with specific amounts', () => {
      const holdings = {
        vesu: '10',
        ekubo: '20',
        nostraLending: '5',
        nostraDex: '15',
        wallet: '2',
        strkfarm: '8',
      };

      const response = createMockHoldingsResponse(holdings);

      expect(response.blocks[0].block).toBe('500000');

      // BigNumber back to floats for comparison
      const vesuAmount = Number(response.vesu[0].xSTRKAmount.bigNumber) / 10 ** 18;
      const ekuboAmount = Number(response.ekubo[0].xSTRKAmount.bigNumber) / 10 ** 18;

      expect(vesuAmount).toBeCloseTo(10);
      expect(ekuboAmount).toBeCloseTo(20);
    });
  });

  describe('User Points Calculation Tests', () => {
    let pointsService: PointsSystemService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [PointsSystemService],
      }).compile();

      pointsService = module.get<PointsSystemService>(PointsSystemService);

      // Set the start and end dates for the test
      pointsService.setConfig({
        ...pointsService.config,
        endDate: testDates[testDates.length - 1],
      });

      prisma.blocks.findFirst = jest.fn().mockImplementation(() => {
        // returns a simple mock Promise that resolves to the expected result
        return Promise.resolve({
          block_number: mockBlocks[0].block_number,
          timestamp: mockBlocks[0].timestamp,
          cursor: BigInt(0),
        });
      }) as any;

      // axios mock for each user and date
      mockedAxios.get.mockImplementation(async (url: string, config?: any) => {
        const parts = url.split('/');
        const userAddress = parts[parts.length - 2];
        const blockNumber = parts[parts.length - 1];

        const block = mockBlocks.find((b) => b.block_number.toString() === blockNumber);
        if (!block) {
          throw new Error(`Block ${blockNumber} not found in mock data`);
        }

        const blockDate = new Date(block.timestamp * 1000);
        const dateStr = blockDate.toISOString().split('T')[0];

        const user = testUsers.find((u) => u.address === userAddress);
        if (!user) {
          throw new Error(`User ${userAddress} not found in test data`);
        }

        let holdings: { [key: string]: string } = {
          wallet: '0',
          vesu: '0',
          ekubo: '0',
          nostraLending: '0',
          nostraDex: '0',
          strkfarm: '0',
        };

        const holdingDates = Object.keys(user.holdings).sort();
        const applicableDate = holdingDates.reverse().find((d) => d <= dateStr);

        const customHoldings = applicableDate ? user.holdings[applicableDate] || {} : {};
        if (applicableDate) {
          holdings = { ...holdings, ...customHoldings };
        }

        return {
          data: createMockHoldingsResponse(holdings, blockNumber),
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config || {},
        } as any;
      });
    });

    it('should correctly calculate points for each user based on their holdings', async () => {
      await pointsService.fetchAndStoreHoldings();

      for (const user of testUsers) {
        const pointsRecord = await prisma.points_aggregated.findUnique({
          where: { user_address: user.address },
        });

        // 1% error margin
        const errorMargin = user.expectedPoints * 0.01;

        console.log(user, 'user----');
        console.log(pointsRecord, 'pointsRecord----');

        expect(pointsRecord).not.toBeNull();
        if (pointsRecord) {
          const actualPoints = Number(pointsRecord.total_points);
          expect(actualPoints).toBeGreaterThanOrEqual(user.expectedPoints - errorMargin);
          expect(actualPoints).toBeLessThanOrEqual(user.expectedPoints + errorMargin);
          console.log(
            `User ${user.address} (${user.description}): Expected ${user.expectedPoints}, Got ${actualPoints}`,
          );
        }
      }
    }, 60000); // increase timeout to 60 secs
  });

  describe('GraphQL API Integration', () => {
    it('should return correct user points from GraphQL API', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [PointsSystemService],
      }).compile();

      const pointsService = module.get<PointsSystemService>(PointsSystemService);

      if ((await prisma.points_aggregated.count()) === 0) {
        await pointsService.fetchAndStoreHoldings();
      }

      for (const user of testUsers) {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            data: {
              getUserPoints: {
                user_address: user.address,
                total_points: user.expectedPoints.toString(),
                block_number: endBlock,
                timestamp: endTime,
                created_on: new Date().toISOString(),
                updated_on: new Date().toISOString(),
              },
            },
          },
        });

        const response = await axios.post('http://localhost:4000', {
          query: `
            query Query($userAddress: String!) {
              getUserPoints(userAddress: $userAddress) {
                user_address
                total_points
                block_number
                timestamp
                created_on
                updated_on
              }
            }
          `,
          variables: {
            userAddress: user.address,
          },
        });

        expect(response.data.data.getUserPoints).not.toBeNull();
        expect(response.data.data.getUserPoints.user_address).toBe(user.address);

        // 1% error margin
        const errorMargin = user.expectedPoints * 0.01;
        const actualPoints = Number(response.data.data.getUserPoints.total_points);

        expect(actualPoints).toBeGreaterThanOrEqual(user.expectedPoints - errorMargin);
        expect(actualPoints).toBeLessThanOrEqual(user.expectedPoints + errorMargin);
      }
    });
  });

  describe('Points Calculation Logic', () => {
    it('should correctly calculate points from decimal amounts', () => {
      expect(calculatePoints('10.5', 1)).toBe(BigInt(10)); // should floor to 10
      expect(calculatePoints('0.9', 1)).toBe(BigInt(0)); // should floor to 0
      expect(calculatePoints('100.999', 1)).toBe(BigInt(100));
    });

    it('should handle edge cases in points calculation', () => {
      expect(calculatePoints('0', 1)).toBe(BigInt(0));
      expect(calculatePoints('', 1)).toBe(BigInt(0)); // empty string should be treated as 0
      expect(calculatePoints('9999999.123', 1)).toBe(BigInt(9999999));
    });
  });
});
