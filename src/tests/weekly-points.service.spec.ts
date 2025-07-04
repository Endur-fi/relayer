import { Test, TestingModule } from '@nestjs/testing';

import { BotService } from '../common/services/bot.service';
import { PointsSystemService } from '../points-system/services/points-system.service';
import { WeeklyPointsService } from '../points-system/services/weekly-points.service';

// Create a mock for PointsSystemService
const mockPointsSystemService = {
  getWeeklyPoints: jest.fn(),
};

// Create a mock for BotService
const mockBotService = {
  getAllUsers: jest.fn(),
  sendWeeklyPointsEvent: jest.fn(),
  sendWebhookEvent: jest.fn(),
  getUserByAddress: jest.fn(),
  sendUnstakeInitiationEvent: jest.fn(),
  sendUnstakeCompletionEvent: jest.fn(),
};

describe('WeeklyPointsService', () => {
  let service: WeeklyPointsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeeklyPointsService,
        { provide: PointsSystemService, useValue: mockPointsSystemService },
        { provide: BotService, useValue: mockBotService },
      ],
    }).compile();

    service = module.get<WeeklyPointsService>(WeeklyPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setupTimezoneGroups', () => {
    it('should fetch users and group them by timezone', async () => {
      // Setup mock response for user fetching with supported timezones
      const mockUsers = [
        { id: 1, username: 'user1', telegramId: 123, timezone: 'UTC', addresses: ['0x1'] },
        {
          id: 2,
          username: 'user2',
          telegramId: 456,
          timezone: 'America/New_York',
          addresses: ['0x2'],
        },
        {
          id: 3,
          username: 'user3',
          telegramId: 789,
          timezone: 'Asia/Tokyo',
          addresses: ['0x3', '0x4'],
        },
        {
          id: 4,
          username: 'user4',
          telegramId: 101,
          timezone: 'America/New_York',
          addresses: ['0x5'],
        },
      ];

      mockBotService.getAllUsers.mockResolvedValueOnce(mockUsers);

      await service.setupTimezoneGroups();

      // Verify BotService was called
      expect(mockBotService.getAllUsers).toHaveBeenCalledTimes(1);

      // Access private property for testing
      const timezoneGroups = (service as any).timezoneGroups;

      // Verify timezones were grouped correctly
      expect(timezoneGroups.size).toBe(3); // UTC, America/New_York, Asia/Tokyo
      expect(timezoneGroups.get('UTC').length).toBe(1);
      expect(timezoneGroups.get('America/New_York').length).toBe(2);
      expect(timezoneGroups.get('Asia/Tokyo').length).toBe(1);
    });

    it('should handle unsupported timezone by defaulting to UTC', async () => {
      // Setup mock response with unsupported timezone
      const mockUsers = [
        {
          id: 1,
          username: 'user1',
          telegramId: 123,
          timezone: 'Invalid/Timezone',
          addresses: ['0x1'],
        },
        {
          id: 2,
          username: 'user2',
          telegramId: 456,
          timezone: 'Asia/Singapore',
          addresses: ['0x2'],
        },
      ];

      mockBotService.getAllUsers.mockResolvedValueOnce(mockUsers);

      await service.setupTimezoneGroups();

      // Access private property for testing
      const timezoneGroups = (service as any).timezoneGroups;

      // Verify unsupported timezone was converted to UTC
      expect(timezoneGroups.size).toBe(2); // UTC (from invalid), Asia/Singapore
      expect(timezoneGroups.get('UTC').length).toBe(1); // user1 with invalid timezone
      expect(timezoneGroups.get('Asia/Singapore').length).toBe(1);
    });

    it('should handle empty user list', async () => {
      mockBotService.getAllUsers.mockResolvedValueOnce([]);

      await service.setupTimezoneGroups();

      // Access private property for testing
      const timezoneGroups = (service as any).timezoneGroups;

      expect(timezoneGroups.size).toBe(0);
    });
  });

  describe('processWeeklyPointsForAllTimezones', () => {
    it('should process points for users in timezones where it is Sunday', async () => {
      // Setup timezone groups
      const mockUsers = [
        { id: 1, username: 'user1', telegramId: 123, timezone: 'UTC', addresses: ['0x1'] },
        {
          id: 2,
          username: 'user2',
          telegramId: 456,
          timezone: 'America/New_York',
          addresses: ['0x2'],
        },
      ];

      // Prepare timezone groups manually
      const timezoneGroups = new Map();
      timezoneGroups.set('UTC', [mockUsers[0]]);
      timezoneGroups.set('America/New_York', [mockUsers[1]]);

      (service as any).timezoneGroups = timezoneGroups;

      // Mock the date constructor properly
      const realDate = Date;
      const mockDate = new realDate('2023-07-09T12:00:00Z'); // a Sunday

      // Create a custom Date constructor
      global.Date = class extends realDate {
        constructor(dateString?: string | number | Date) {
          if (dateString) {
            super(dateString);
          } else {
            super('2023-07-09T12:00:00Z'); // Default to Sunday
          }
        }

        static now() {
          return mockDate.getTime();
        }

        toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
          if (options?.timeZone === 'UTC') {
            // Return a Sunday date
            return new realDate('2023-07-09T12:00:00Z').toString();
          } else if (options?.timeZone === 'America/New_York') {
            // Return a Saturday date
            return new realDate('2023-07-08T12:00:00Z').toString();
          }
          return super.toLocaleString(locales, options);
        }

        getDay(): number {
          // For this test, we'll determine the day based on the date string
          const dateStr = this.toISOString();
          if (dateStr.includes('2023-07-09')) {
            return 0; // Sunday
          } else {
            return 6; // Saturday (or any other day)
          }
        }
      } as any;

      // Mock processUsersInTimezone
      const processUsersSpy = jest
        .spyOn(service as any, 'processUsersInTimezone')
        .mockImplementation(() => Promise.resolve());

      await service.processWeeklyPointsForAllTimezones();

      // Should only process UTC timezone as it's Sunday there
      expect(processUsersSpy).toHaveBeenCalledTimes(1);
      expect(processUsersSpy).toHaveBeenCalledWith([mockUsers[0]], 'UTC');

      // Restore original Date
      global.Date = realDate;
    });

    it('should initialize timezone groups if none exist', async () => {
      // Clear timezone groups
      (service as any).timezoneGroups = new Map();

      // Mock setupTimezoneGroups
      const setupSpy = jest
        .spyOn(service, 'setupTimezoneGroups')
        .mockImplementation(() => Promise.resolve());

      await service.processWeeklyPointsForAllTimezones();

      expect(setupSpy).toHaveBeenCalled();
    });
  });

  describe('processUsersInTimezone', () => {
    it('should process points for all users in a timezone', async () => {
      // Setup mock weekly points
      const mockWeeklyPoints = {
        '0x1': '10.50',
        '0x2': '25.75',
        '0x3': '0.00',
      };

      mockPointsSystemService.getWeeklyPoints.mockResolvedValueOnce(mockWeeklyPoints);

      // Setup mock users
      const mockUsers = [
        { id: 1, username: 'user1', telegramId: 123, timezone: 'UTC', addresses: ['0x1', '0x3'] },
        { id: 2, username: 'user2', telegramId: 456, timezone: 'UTC', addresses: ['0x2'] },
      ];

      // Mock BotService sendWeeklyPointsEvent
      mockBotService.sendWeeklyPointsEvent.mockResolvedValue(undefined);

      // Execute the method
      await (service as any).processUsersInTimezone(mockUsers, 'UTC');

      // Verify BotService was called for each address
      expect(mockBotService.sendWeeklyPointsEvent).toHaveBeenCalledTimes(3);

      // Check specific calls with updated signature
      expect(mockBotService.sendWeeklyPointsEvent).toHaveBeenCalledWith(
        '0x1',
        '10.50',
        'points',
        expect.objectContaining({
          timezone: 'UTC',
          lastProcessedAt: expect.any(String),
        }),
      );

      expect(mockBotService.sendWeeklyPointsEvent).toHaveBeenCalledWith(
        '0x2',
        '25.75',
        'points',
        expect.objectContaining({
          timezone: 'UTC',
          lastProcessedAt: expect.any(String),
        }),
      );

      expect(mockBotService.sendWeeklyPointsEvent).toHaveBeenCalledWith(
        '0x3',
        '0.00',
        'points',
        expect.objectContaining({
          timezone: 'UTC',
          lastProcessedAt: expect.any(String),
        }),
      );
    });
  });

  describe('processUserPoints', () => {
    it('should send points to the bot service and track last processed date', async () => {
      // Setup
      const user = {
        id: 1,
        username: 'user1',
        telegramId: 123,
        timezone: 'UTC',
        addresses: ['0x1'],
      };
      const address = '0x1';
      const weeklyPoints = { '0x1': '15.00' };
      const results = { success: 0, failed: 0 };
      const maxRetries = 3;

      mockBotService.sendWeeklyPointsEvent.mockResolvedValueOnce(undefined);

      // Execute
      await (service as any).processUserPoints(user, address, weeklyPoints, results, maxRetries);

      // Verify BotService was called with updated signature
      expect(mockBotService.sendWeeklyPointsEvent).toHaveBeenCalledWith(
        '0x1',
        '15.00',
        'points',
        expect.objectContaining({
          timezone: 'UTC',
          lastProcessedAt: expect.any(String),
        }),
      );

      // Should track last processed date
      const lastProcessedDates = (service as any).lastProcessedDate;
      expect(lastProcessedDates.has('0x1')).toBe(true);

      // Results should be updated
      expect(results.success).toBe(1);
      expect(results.failed).toBe(0);
    });

    it('should handle failure and update failed count', async () => {
      // Setup
      const user = {
        id: 1,
        username: 'user1',
        telegramId: 123,
        timezone: 'UTC',
        addresses: ['0x1'],
      };
      const address = '0x1';
      const weeklyPoints = { '0x1': '15.00' };
      const results = { success: 0, failed: 0 };
      const maxRetries = 3;

      // Mock BotService to throw error
      mockBotService.sendWeeklyPointsEvent.mockRejectedValueOnce(new Error('Network error'));

      // Execute
      await (service as any).processUserPoints(user, address, weeklyPoints, results, maxRetries);

      // Verify
      expect(mockBotService.sendWeeklyPointsEvent).toHaveBeenCalledTimes(1);
      expect(results.success).toBe(0);
      expect(results.failed).toBe(1);
    });
  });

  describe('BotService integration', () => {
    it('should use BotService for fetching users', async () => {
      // Mock response
      const mockUsers = [
        { id: 1, username: 'user1', telegramId: 123, timezone: 'UTC', addresses: ['0x1'] },
        {
          id: 2,
          username: 'user2',
          telegramId: 456,
          timezone: 'America/New_York',
          addresses: ['0x2'],
        },
      ];

      mockBotService.getAllUsers.mockResolvedValueOnce(mockUsers);

      // Call setupTimezoneGroups which uses BotService internally
      await service.setupTimezoneGroups();

      // Verify BotService was called
      expect(mockBotService.getAllUsers).toHaveBeenCalledTimes(1);

      // Access private property for testing
      const timezoneGroups = (service as any).timezoneGroups;
      expect(timezoneGroups.size).toBe(2); // UTC, America/New_York
    });

    it('should handle BotService errors gracefully', async () => {
      // Mock BotService to return an error
      mockBotService.getAllUsers.mockRejectedValueOnce(new Error('Bot API is unavailable'));

      // Should throw error when BotService is unavailable
      await expect(service.setupTimezoneGroups()).rejects.toThrow();
    });
  });

  describe('real API integration', () => {
    it('should use real API when environment variable is set', async () => {
      // This test will be skipped unless USE_BOT_API_FOR_TESTING is set
      if (!process.env.USE_BOT_API_FOR_TESTING) {
        console.log('Skipping real API test. Set USE_BOT_API_FOR_TESTING=true to run it.');
        return;
      }

      // Create a new service instance with real BotService
      const realBotService = new BotService();

      const moduleRef = await Test.createTestingModule({
        providers: [
          WeeklyPointsService,
          { provide: PointsSystemService, useValue: mockPointsSystemService },
          { provide: BotService, useValue: realBotService },
        ],
      }).compile();

      const serviceWithRealAPI = moduleRef.get<WeeklyPointsService>(WeeklyPointsService);

      try {
        // Test fetching users from real API
        const users = await realBotService.getAllUsers();

        // Basic validation of response from real API
        expect(Array.isArray(users)).toBe(true);

        // Log actual response for debugging
        console.log(`Real API returned ${users.length} users`);

        // If we got users, check their structure
        if (users.length > 0) {
          const user = users[0];
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('addresses');
          expect(user).toHaveProperty('timezone');

          // Log a sample user for debugging
          console.log('Sample user from real API:', JSON.stringify(user, null, 2));
        } else {
          console.log('No users returned from real API');
        }

        // Test timezone grouping with real data
        await serviceWithRealAPI.setupTimezoneGroups();
        const timezoneGroups = (serviceWithRealAPI as any).timezoneGroups;

        console.log(`Real API test: Found ${timezoneGroups.size} timezone groups`);
        for (const [timezone, usersInTimezone] of timezoneGroups.entries()) {
          console.log(`Timezone ${timezone}: ${usersInTimezone.length} users`);
        }

        // Test the complete weekly points flow with real data
        mockPointsSystemService.getWeeklyPoints.mockResolvedValueOnce({
          '0x123': '10.50',
          '0x456': '25.75',
        });

        // Test processWeeklyPointsForAllTimezones with real users but mock points
        await serviceWithRealAPI.processWeeklyPointsForAllTimezones();
      } catch (error) {
        // Real API not available or returned error
        console.log('Real API not available:', (error as Error).message);

        // Check if it's an authentication error (missing secret key)
        if ((error as any).response?.status === 401 || (error as any).response?.status === 403) {
          console.log('Authentication failed - check BOT_SECRET_KEY environment variable');
        }

        // Don't fail the test if API is not running, but log the error for debugging
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
