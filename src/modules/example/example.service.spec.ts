import { NotFoundException } from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { Example } from '../../entities/example.entity';
import { ExampleService } from './example.service';
import { ExamplesRepository } from './example.repository';

type MockRepository = Partial<Record<keyof ExamplesRepository, jest.Mock>>;

const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  findAndCountAll: jest.fn(),
  findOneById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ExampleService', () => {
  let service: ExampleService;
  let repository: MockRepository;

  const example: Example = {
    id: '0ef96f94-cd07-4e88-81f5-c0fdf66ed87c',
    name: 'Example name',
    status: 'active',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        {
          provide: ExamplesRepository,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    const contextId = ContextIdFactory.create();

    service = await module.resolve<ExampleService>(ExampleService, contextId);
    repository = await module.resolve<MockRepository>(ExamplesRepository, contextId);
  });

  it('creates an example', async () => {
    const dto = { name: 'Example name', status: 'active' };

    repository.create?.mockResolvedValue(example);

    await expect(service.create(dto)).resolves.toEqual(
      expect.objectContaining({
        id: example.id,
        name: example.name,
        status: example.status,
      }),
    );
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('returns all examples', async () => {
    repository.findAndCountAll?.mockResolvedValue({ data: [example], total: 1 });

    await expect(
      service.findAll({ page: 1, limit: 10 } as any),
    ).resolves.toEqual({
      data: [expect.objectContaining({ id: example.id })],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
    expect(repository.findAndCountAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('returns one example by id', async () => {
    repository.findOneById?.mockResolvedValue(example);

    await expect(service.findOne(example.id)).resolves.toEqual(
      expect.objectContaining({ id: example.id }),
    );
    expect(repository.findOneById).toHaveBeenCalledWith(example.id);
  });

  it('throws when an example cannot be found', async () => {
    repository.findOneById?.mockResolvedValue(null);

    await expect(service.findOne(example.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates an example', async () => {
    const dto = { status: 'inactive' };
    const updatedExample = { ...example, ...dto };

    repository.update?.mockResolvedValue(updatedExample);
    repository.findOneById?.mockResolvedValue(updatedExample);

    await expect(service.update(example.id, dto)).resolves.toEqual(
      expect.objectContaining({ id: updatedExample.id, status: dto.status }),
    );
    expect(repository.update).toHaveBeenCalledWith(example.id, dto);
  });

  it('soft deletes an example', async () => {
    repository.delete?.mockResolvedValue({ affected: 1 });

    await expect(service.remove(example.id)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(example.id);
  });

  it('throws when soft deleting a missing example', async () => {
    repository.delete?.mockResolvedValue({ affected: 0 });

    await expect(service.remove(example.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
