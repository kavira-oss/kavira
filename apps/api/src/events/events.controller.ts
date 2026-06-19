import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('behavior/:behaviorId')
  findAllForBehavior(@Param('behaviorId') behaviorId: string) {
    return this.eventsService.findAllForBehavior(behaviorId);
  }

  @Post()
  create(
    @Body() body: { behaviorId: string; occurredAt?: string; metadata?: object },
  ) {
    return this.eventsService.create({
      ...body,
      occurredAt: body.occurredAt ? new Date(body.occurredAt) : undefined,
    });
  }
}
