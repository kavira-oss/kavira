import { Injectable, NotFoundException } from '@nestjs/common';
import { calculateStreak, StreakResult, toStartOfDay, getDayOfWeekKey } from '@kavira/utils';
import { BehaviorFrequency } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CompletionRateResult {
  behaviorId: string;
  completionRate: number; // percentage 0-100
  expectedDays: number;
  completedDays: number;
}

const WEEKDAY_KEYS = new Set(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
const WEEKEND_KEYS = new Set(['saturday', 'sunday']);

// CUSTOM has no per-behavior weekday configuration in the schema yet
// (see PRD open questions), so it's treated as DAILY until that's added.
function isExpectedDay(frequency: BehaviorFrequency, date: Date): boolean {
  const key = getDayOfWeekKey(date);
  if (frequency === BehaviorFrequency.WEEKDAYS) return WEEKDAY_KEYS.has(key);
  if (frequency === BehaviorFrequency.WEEKENDS) return WEEKEND_KEYS.has(key);
  return true;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStreakForUser(userId: string): Promise<StreakResult> {
    const events = await this.prisma.event.findMany({
      where: { behavior: { userId } },
      select: { occurredAt: true },
    });

    const eventDates = events.map((event) => event.occurredAt);

    return calculateStreak(eventDates);
  }

  async getCompletionRate(behaviorId: string): Promise<CompletionRateResult> {
    const behavior = await this.prisma.behavior.findFirst({
      where: { id: behaviorId, deletedAt: null },
    });
    if (!behavior) {
      throw new NotFoundException(`Behavior ${behaviorId} not found`);
    }

    const events = await this.prisma.event.findMany({
      where: { behaviorId },
      select: { occurredAt: true },
    });
    const completedDays = new Set(
      events.map((event) => toStartOfDay(event.occurredAt).getTime()),
    );

    const start = toStartOfDay(behavior.createdAt);
    const end = toStartOfDay(new Date());

    let expectedDays = 0;
    let completedExpectedDays = 0;
    for (let d = new Date(start); d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
      if (!isExpectedDay(behavior.frequency, d)) continue;
      expectedDays++;
      if (completedDays.has(d.getTime())) completedExpectedDays++;
    }

    const completionRate =
      expectedDays === 0 ? 0 : Math.round((completedExpectedDays / expectedDays) * 100);

    return {
      behaviorId,
      completionRate,
      expectedDays,
      completedDays: completedExpectedDays,
    };
  }
}
