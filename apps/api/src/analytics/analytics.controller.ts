import { Controller, Get, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('streak')
  getStreak(@Request() req: any) {
    // Extract userId from authenticated user to prevent IDOR
    // Note: Requires authentication middleware/guard to populate req.user
    const userId = req.user?.id || req.user?.userId;
    return this.analyticsService.getStreakForUser(userId);
  }
}
