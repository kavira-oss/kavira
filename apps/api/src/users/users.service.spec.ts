import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
// Use runtime require to avoid TypeScript resolving issues in some CI environments
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Prisma = require('@prisma/client');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('returns all users', async () => {
      const users = [{ id: '1', email: 'a@test.com' }];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns a user when found', async () => {
      const user = { id: '1', email: 'a@test.com' };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });

    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a user', async () => {
      const data = {
        email: 'new@test.com',
        username: 'newuser',
        passwordHash: 'hashed',
      };
      const created = { id: '1', ...data };
      prisma.user.create.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toEqual(created);
      expect(prisma.user.create).toHaveBeenCalledWith({ data });
    });

    it('throws ConflictException when unique constraint violation occurs', async () => {
      const data = {
        email: 'dup@test.com',
        username: 'dupuser',
        passwordHash: 'hashed',
      };

      // create an object that passes the `instanceof Prisma.PrismaClientKnownRequestError` check
      const prismaErr = Object.create(Prisma.PrismaClientKnownRequestError.prototype);
      prismaErr.code = 'P2002';

      prisma.user.create.mockRejectedValue(prismaErr);

      await expect(service.create(data)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('removes a user after confirming it exists', async () => {
      const user = { id: '1', email: 'a@test.com' };
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.delete.mockResolvedValue(user);

      const result = await service.remove('1');

      expect(result).toEqual(user);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('throws NotFoundException when removing a non-existing user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});