import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // Events are append-only: no update or delete methods.
  findAllForBehavior(behaviorId: string) {
    return this.prisma.event.findMany({
      where: { behaviorId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  create(data: { behaviorId: string; occurredAt?: Date; metadata?: object }) {
    return this.prisma.event.create({ data });
  }
}
