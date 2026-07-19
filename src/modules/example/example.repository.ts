import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import express from 'express';
import { BaseRepository } from '../../utils/base/base-repository';
import { DataSource } from 'typeorm';
import { Example } from '../../entities/example.entity';
import { CreateExampleDto } from './dto/create-example.dto';
import { SelectQueryBuilder } from 'typeorm/browser';
import { ExampleFilter } from './exmaple.filter';

@Injectable({ scope: Scope.REQUEST })
export class ExamplesRepository extends BaseRepository {
  constructor(dataSource: DataSource,
    @Inject(REQUEST) req: express.Request,
    private readonly exampleFilter: ExampleFilter,
  ) {
    super(dataSource, req);
  }

  async findOneById(id: string) {
    const repository = this.getRepository(Example);
    return repository.findOne({ where: { id } });
  }

  async create(data: CreateExampleDto) {
    const repository = this.getRepository(Example);
    const example = repository.create(data);
    return repository.save(example);
  }

  async update(id: string, data: Partial<CreateExampleDto>) {
    const repository = this.getRepository(Example);
    const example = await this.findOneById(id);
    repository.merge(example, data);
    return repository.save(example);
  }

  async delete(id: string) {
    const repository = this.getRepository(Example);
    const example = await this.findOneById(id);
    return repository.softDelete(example);
  }

  async findAndCountAll(filter: any): Promise<{ data: Example[]; total: number }> {
    const repository = this.getRepository(Example);
    const qb = repository.createQueryBuilder('example');

    this.exampleFilter.apply(qb, filter);

    const [data, total] = await qb
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    return { data, total };
  }
}