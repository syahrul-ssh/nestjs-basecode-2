import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Example } from '../../entities/example.entity';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ExampleFilterDto } from './dto/filter-example.dto';
import { ExampleFilter } from './exmaple.filter';
import { applySorting } from '../../utils/helper/filter';
import { paginate } from '../../utils/helper/paginate';
import { ExampleResponseDto } from './dto/response-example.dto';
import { DtoTransformer } from '../../utils/helper/transformer';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
    private readonly exampleFilter: ExampleFilter,
  ) {}

  async create(createExampleDto: CreateExampleDto): Promise<Example> {
    const example = this.exampleRepository.create(createExampleDto);

    return this.exampleRepository.save(example);
  }

  async findAll(filter: ExampleFilterDto): Promise<any> {
    const qb = this.exampleRepository.createQueryBuilder('example');

    this.exampleFilter.apply(qb, filter);

    const [data, total] = await qb
      .skip((filter.page - 1) * filter.limit)
      .take(filter.limit)
      .getManyAndCount();

    const paginated = await paginate(data, total, filter.page, filter.limit);

    return DtoTransformer.paginated(ExampleResponseDto, paginated);
  }

  async findOne(id: string): Promise<Example> {
    const example = await this.exampleRepository.findOne({ where: { id } });

    if (!example) {
      throw new NotFoundException(`Example with id "${id}" not found`);
    }

    return example;
  }

  async update(
    id: string,
    updateExampleDto: UpdateExampleDto,
  ): Promise<Example> {
    const example = await this.findOne(id);
    const updatedExample = this.exampleRepository.merge(
      example,
      updateExampleDto,
    );

    return this.exampleRepository.save(updatedExample);
  }

  async remove(id: string): Promise<void> {
    const result = await this.exampleRepository.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException(`Example with id "${id}" not found`);
    }
  }
}
