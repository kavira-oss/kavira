import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.sessionsService.findAllForUser(userId);
  }

  @Post()
  create(
    @Body()
    body: {
      userId: string;
      refreshToken: string;
      deviceInfo?: string;
      ipAddress?: string;
      expiresAt: string;
    },
  ) {
    return this.sessionsService.create({
      ...body,
      expiresAt: new Date(body.expiresAt),
    });
  }

  @Patch(':id/revoke')
  revoke(@Param('id') id: string) {
    return this.sessionsService.revoke(id);
  }
}
