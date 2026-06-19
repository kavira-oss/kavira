import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.session.findMany({ where: { userId, revokedAt: null } });
  }

  create(data: {
    userId: string;
    refreshToken: string;
    deviceInfo?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return this.prisma.session.create({ data });
  }

  async revoke(id: string) {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) throw new NotFoundException(`Session ${id} not found`);
    return this.prisma.session.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
