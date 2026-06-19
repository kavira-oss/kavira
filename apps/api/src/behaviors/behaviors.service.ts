import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BehaviorsService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.behavior.findMany({
      where: { userId, deletedAt: null },
    });
  }

  async findOne(id: string) {
    const behavior = await this.prisma.behavior.findFirst({
      where: { id, deletedAt: null },
    });
    if (!behavior) throw new NotFoundException(`Behavior ${id} not found`);
    return behavior;
  }

  create(data: { userId: string; title: string; description?: string }) {
    return this.prisma.behavior.create({ data });
  }

  async archive(id: string) {
    await this.findOne(id);
    return this.prisma.behavior.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  }

  // Soft delete: marks deletedAt, never removes the row.
  // Events remain attached and queryable for history/audit purposes.
  async softDelete(id: string) {
    await this.findOne(id);
    return this.prisma.behavior.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
