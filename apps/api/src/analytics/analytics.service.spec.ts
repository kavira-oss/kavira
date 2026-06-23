import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

// Returns a Date `n` days before now, pinned to noon so day-boundary
// rounding in calculateStreak is never affected by the time the test runs.
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      event: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getStreakForUser', () => {
    it('returns zero streaks when the user has no events', async () => {
      prisma.event.findMany.mockResolvedValue([]);

      const result = await service.getStreakForUser('user-1');

      expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    it('resets the current streak after a gap, but preserves the longest streak', async () => {
      // Older 3-day run (18, 19, 20 days ago) is the longest streak.
      // More recent 2-day run (9, 10 days ago) is shorter and still broken
      // (more than 1 day before "today"), so currentStreak must be 0.
      const events = [
        { occurredAt: daysAgo(9) },
        { occurredAt: daysAgo(10) },
        { occurredAt: daysAgo(18) },
        { occurredAt: daysAgo(19) },
        { occurredAt: daysAgo(20) },
      ];
      prisma.event.findMany.mockResolvedValue(events);

      const result = await service.getStreakForUser('user-1');

      expect(result).toEqual({ currentStreak: 0, longestStreak: 3 });
    });

    it('deduplicates multiple events logged on the same day', async () => {
      // Two events today (different times) + one yesterday should count
      // as a 2-day streak, not be inflated by the duplicate same-day entry.
      const today = daysAgo(0);
      const todayLater = new Date(today);
      todayLater.setHours(18, 0, 0, 0);

      const events = [
        { occurredAt: today },
        { occurredAt: todayLater },
        { occurredAt: daysAgo(1) },
      ];
      prisma.event.findMany.mockResolvedValue(events);

      const result = await service.getStreakForUser('user-1');

      expect(result).toEqual({ currentStreak: 2, longestStreak: 2 });
    });
  });
});
