import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BehaviorsService', () => {
  let service: BehaviorsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      behavior: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BehaviorsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BehaviorsService>(BehaviorsService);
  });

  describe('findAllForUser', () => {
    it('returns all non-deleted behaviors for a user', async () => {
      const behaviors = [{ id: '1', userId: 'user-1', title: 'Read' }];
      prisma.behavior.findMany.mockResolvedValue(behaviors);

      const result = await service.findAllForUser('user-1');

      expect(result).toEqual(behaviors);
      expect(prisma.behavior.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', deletedAt: null },
      });
    });

    it('returns an empty array when the user has no behaviors', async () => {
      prisma.behavior.findMany.mockResolvedValue([]);

      const result = await service.findAllForUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns a behavior when found', async () => {
      const behavior = { id: '1', userId: 'user-1', title: 'Read' };
      prisma.behavior.findFirst.mockResolvedValue(behavior);

      const result = await service.findOne('1');

      expect(result).toEqual(behavior);
    });

    it('throws NotFoundException when the behavior does not exist', async () => {
      prisma.behavior.findFirst.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a behavior', async () => {
      const data = { userId: 'user-1', title: 'Read', description: '20 min' };
      const created = { id: '1', ...data };
      prisma.behavior.create.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toEqual(created);
      expect(prisma.behavior.create).toHaveBeenCalledWith({ data });
    });

    it('propagates the error when the underlying create fails', async () => {
      const data = { userId: 'user-1', title: 'Read' };
      prisma.behavior.create.mockRejectedValue(new Error('insert failed'));

      await expect(service.create(data)).rejects.toThrow('insert failed');
    });
  });

  describe('archive', () => {
    it('archives an existing behavior', async () => {
      const behavior = { id: '1', userId: 'user-1', title: 'Read' };
      const archived = { ...behavior, archivedAt: new Date() };
      prisma.behavior.findFirst.mockResolvedValue(behavior);
      prisma.behavior.update.mockResolvedValue(archived);

      const result = await service.archive('1');

      expect(result).toEqual(archived);
      expect(prisma.behavior.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { archivedAt: expect.any(Date) },
      });
    });

    it('throws NotFoundException when archiving a non-existing behavior', async () => {
      prisma.behavior.findFirst.mockResolvedValue(null);

      await expect(service.archive('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.behavior.update).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('soft deletes an existing behavior', async () => {
      const behavior = { id: '1', userId: 'user-1', title: 'Read' };
      const deleted = { ...behavior, deletedAt: new Date() };
      prisma.behavior.findFirst.mockResolvedValue(behavior);
      prisma.behavior.update.mockResolvedValue(deleted);

      const result = await service.softDelete('1');

      expect(result).toEqual(deleted);
      expect(prisma.behavior.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('throws NotFoundException when deleting a non-existing behavior', async () => {
      prisma.behavior.findFirst.mockResolvedValue(null);

      await expect(service.softDelete('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.behavior.update).not.toHaveBeenCalled();
    });
  });
});
