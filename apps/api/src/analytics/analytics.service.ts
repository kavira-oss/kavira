import { Injectable } from '@nestjs/common';
import { calculateStreak, StreakResult } from '@kavira/utils';
import { PrismaService } from '../prisma/prisma.service';

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
}
