import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Example } from '../../entities/example.entity';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {}

  create(createExampleDto: CreateExampleDto): Promise<Example> {
    const example = this.exampleRepository.create(createExampleDto);

    return this.exampleRepository.save(example);
  }

  findAll(): Promise<Example[]> {
    return this.exampleRepository.find();
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
