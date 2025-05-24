import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from '../items.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ItemsService', () => {
  let service: ItemsService;
  let prisma: { item: { findUnique: jest.Mock; findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      item: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: PrismaClient, useValue: prisma },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('throws NotFoundException when item does not exist', async () => {
    prisma.item.findUnique.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns items array on findAll', async () => {
    const items = [{ id: 1, sku: 'test' }];
    prisma.item.findMany.mockResolvedValue(items);
    await expect(service.findAll()).resolves.toEqual(items);
  });
});
