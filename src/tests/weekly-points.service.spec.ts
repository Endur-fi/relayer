import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { BotService } from '../common/services/bot.service';
import { WeeklyPointsService } from '../points-system/services/weekly-points.service';

describe('WeeklyPointsService', () => {
  let service: WeeklyPointsService;
  let botService: jest.Mocked<BotService>;
  let prisma: {
    cumulative_weekly_snapshot_points: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
    };
    points_aggregated: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    const mockBotService = {
      getAllUsers: jest.fn(),
      sendWeeklyPointsEvent: jest.fn(),
    };

    const mockPrisma = {
      cumulative_weekly_snapshot_points: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
      points_aggregated: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeeklyPointsService,
        { provide: BotService, useValue: mockBotService },
        { provide: PrismaClient, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WeeklyPointsService>(WeeklyPointsService);
    botService = module.get(BotService) as jest.Mocked<BotService>;
    prisma = module.get(PrismaClient) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processWeeklyPointsForAllUsers', () => {
    it('should process points for all users', async () => {
      // Setup mock users
      const mockUsers = [
        { id: 1, username: 'user1', telegramId: 123, timezone: 'UTC', addresses: ['0x1', '0x3'] },
        {
          id: 2,
          username: 'user2',
          telegramId: 456,
          timezone: 'America/New_York',
          addresses: ['0x2'],
        },
      ];

      // Setup mock weekly points delta
      const mockWeeklyDelta = {
        '0x1': '10.50',
        '0x2': '25.75',
        '0x3': '0.00',
      };

      botService.getAllUsers.mockResolvedValue(mockUsers);
      jest.spyOn(service as any, 'calculateWeeklyPointsDelta').mockResolvedValue(mockWeeklyDelta);
      botService.sendWeeklyPointsEvent.mockResolvedValue(undefined);

      await service.processWeeklyPointsForAllUsers();

      expect(botService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(botService.sendWeeklyPointsEvent).toHaveBeenCalledTimes(3);

      // Verify calls with correct parameters including week metadata
      expect(botService.sendWeeklyPointsEvent).toHaveBeenCalledWith(
        '0x1',
        '10.50',
        'points',
        expect.objectContaining({
          timezone: 'UTC',
          weekStartDate: expect.any(String),
          weekEndDate: expect.any(String),
          processedAt: expect.any(String),
        }),
      );
    });

    it('should handle empty user list', async () => {
      botService.getAllUsers.mockResolvedValue([]);

      await service.processWeeklyPointsForAllUsers();

      expect(botService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(botService.sendWeeklyPointsEvent).not.toHaveBeenCalled();
    });
  });

  describe('calculateWeeklyPointsDelta', () => {
    it('should correctly calculate weekly points delta', async () => {
      // Mock data
      const mockSnapshot = {
        week_start_date: new Date('2023-07-02'),
      };

      const mockPreviousSnapshots = [
        { user_address: '0x1', total_points: BigInt(100) },
        { user_address: '0x2', total_points: BigInt(200) },
      ];

      const mockCurrentPoints = [
        { user_address: '0x1', total_points: BigInt(150) },
        { user_address: '0x2', total_points: BigInt(200) },
        { user_address: '0x3', total_points: BigInt(300) },
      ];

      // Reset mocks before setting new implementations
      prisma.cumulative_weekly_snapshot_points.findFirst.mockReset();
      prisma.cumulative_weekly_snapshot_points.findMany.mockReset();
      prisma.points_aggregated.findMany.mockReset();

      // Setup mock implementations
      prisma.cumulative_weekly_snapshot_points.findFirst.mockResolvedValue(mockSnapshot);
      prisma.cumulative_weekly_snapshot_points.findMany.mockResolvedValue(mockPreviousSnapshots);
      prisma.points_aggregated.findMany.mockResolvedValue(mockCurrentPoints);

      // Call the method
      const result = await (service as any).calculateWeeklyPointsDelta();

      // Debug output
      console.log('Final result:', result);
      console.log(
        'findFirst calls:',
        prisma.cumulative_weekly_snapshot_points.findFirst.mock.calls,
      );
      console.log('findMany calls:', prisma.cumulative_weekly_snapshot_points.findMany.mock.calls);
      console.log('currentPoints calls:', prisma.points_aggregated.findMany.mock.calls);

      // Assertions
      expect(result).toEqual({
        '0x1': '50',
        '0x2': '0',
        '0x3': '300',
      });

      // Verify database calls
      expect(prisma.cumulative_weekly_snapshot_points.findFirst).toHaveBeenCalledWith({
        orderBy: { week_start_date: 'desc' },
      });
      expect(prisma.cumulative_weekly_snapshot_points.findMany).toHaveBeenCalledWith({
        where: { week_start_date: mockSnapshot.week_start_date },
        select: { user_address: true, total_points: true },
      });
      expect(prisma.points_aggregated.findMany).toHaveBeenCalledWith({
        select: { user_address: true, total_points: true },
      });
    });

    it('should return empty object if no previous snapshot exists', async () => {
      prisma.cumulative_weekly_snapshot_points.findFirst.mockResolvedValue(null);

      const result = await (service as any).calculateWeeklyPointsDelta();

      expect(result).toEqual({});
      expect(prisma.cumulative_weekly_snapshot_points.findMany).not.toHaveBeenCalled();
    });
  });

  describe('processUserPoints', () => {
    it('should successfully process user points', async () => {
      const mockUser = {
        id: 1,
        username: 'user1',
        telegramId: 123,
        timezone: 'UTC',
        addresses: ['0x1'],
      };
      const mockResults = { success: 0, failed: 0 };

      botService.sendWeeklyPointsEvent.mockResolvedValue(undefined);

      await (service as any).processUserPoints(mockUser, '0x1', { '0x1': '15.00' }, mockResults);

      expect(botService.sendWeeklyPointsEvent).toHaveBeenCalled();
      expect(mockResults.success).toBe(1);
    });

    it('should handle failed points processing', async () => {
      const mockUser = {
        id: 1,
        username: 'user1',
        telegramId: 123,
        timezone: 'UTC',
        addresses: ['0x1'],
      };
      const mockResults = { success: 0, failed: 0 };

      botService.sendWeeklyPointsEvent.mockRejectedValue(new Error('Network error'));

      await (service as any).processUserPoints(mockUser, '0x1', { '0x1': '15.00' }, mockResults);

      expect(mockResults.success).toBe(0);
      expect(mockResults.failed).toBe(1);
    });
  });
});
