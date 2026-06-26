import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // TODO(#3): switch to req.user.id once the auth guard lands; userId via
  // route param is a temporary IDOR-prone stand-in until then.
  @Get('streak/:userId')
  getStreak(@Param('userId') userId: string) {
    return this.analyticsService.getStreakForUser(userId);
  }

  // TODO(#3): once the auth guard lands, verify the requesting user owns
  // this behavior before returning its completion rate (IDOR otherwise).
  @Get('completion-rate/:behaviorId')
  getCompletionRate(@Param('behaviorId') behaviorId: string) {
    return this.analyticsService.getCompletionRate(behaviorId);
  }
}
