import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Example } from '../../entities/example.entity';
import { ExampleService } from './example.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = (): MockRepository<Example> => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
  softDelete: jest.fn(),
});

describe('ExampleService', () => {
  let service: ExampleService;
  let repository: MockRepository<Example>;

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
          provide: getRepositoryToken(Example),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
    repository = module.get<MockRepository<Example>>(
      getRepositoryToken(Example),
    );
  });

  it('creates an example', async () => {
    const dto = { name: 'Example name', status: 'active' };

    repository.create?.mockReturnValue(example);
    repository.save?.mockResolvedValue(example);

    await expect(service.create(dto)).resolves.toEqual(example);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(example);
  });

  it('returns all examples', async () => {
    repository.find?.mockResolvedValue([example]);

    await expect(service.findAll()).resolves.toEqual([example]);
    expect(repository.find).toHaveBeenCalledWith();
  });

  it('returns one example by id', async () => {
    repository.findOne?.mockResolvedValue(example);

    await expect(service.findOne(example.id)).resolves.toEqual(example);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: example.id },
    });
  });

  it('throws when an example cannot be found', async () => {
    repository.findOne?.mockResolvedValue(null);

    await expect(service.findOne(example.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates an example', async () => {
    const dto = { status: 'inactive' };
    const updatedExample = { ...example, ...dto };

    repository.findOne?.mockResolvedValue(example);
    repository.merge?.mockReturnValue(updatedExample);
    repository.save?.mockResolvedValue(updatedExample);

    await expect(service.update(example.id, dto)).resolves.toEqual(
      updatedExample,
    );
    expect(repository.merge).toHaveBeenCalledWith(example, dto);
    expect(repository.save).toHaveBeenCalledWith(updatedExample);
  });

  it('soft deletes an example', async () => {
    repository.softDelete?.mockResolvedValue({ affected: 1 });

    await expect(service.remove(example.id)).resolves.toBeUndefined();
    expect(repository.softDelete).toHaveBeenCalledWith(example.id);
  });

  it('throws when soft deleting a missing example', async () => {
    repository.softDelete?.mockResolvedValue({ affected: 0 });

    await expect(service.remove(example.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
