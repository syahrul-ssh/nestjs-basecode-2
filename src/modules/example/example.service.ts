import { Injectable, NotFoundException, Scope } from '@nestjs/common';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ExampleFilterDto } from './dto/filter-example.dto';
import { paginate } from '../../utils/helper/paginate';
import { ExampleResponseDto } from './dto/response-example.dto';
import { DtoTransformer } from '../../utils/helper/transformer';
import { ExamplesRepository } from './example.repository';

@Injectable({ scope: Scope.REQUEST })
export class ExampleService {
  constructor(private readonly exampleRepository: ExamplesRepository) {}

  async create(createExampleDto: CreateExampleDto): Promise<ExampleResponseDto> {
    const savedExample = await this.exampleRepository.create(createExampleDto);

    return DtoTransformer.item(ExampleResponseDto, savedExample);
  }

  async findAll(filter: ExampleFilterDto): Promise<{ data: ExampleResponseDto[]; meta: any }> {
    const { data, total } = await this.exampleRepository.findAndCountAll(filter);

    const paginated = await paginate(data, total, filter.page, filter.limit);

    return DtoTransformer.paginated(ExampleResponseDto, paginated);
  }

  async findOne(id: string): Promise<ExampleResponseDto> {
    const example = await this.exampleRepository.findOneById(id);

    if (!example) {
      throw new NotFoundException(`Example with id "${id}" not found`);
    }

    return DtoTransformer.item(ExampleResponseDto, example);
  }

  async update(
    id: string,
    updateExampleDto: UpdateExampleDto,
  ): Promise<ExampleResponseDto> {
    await this.exampleRepository.update(id, updateExampleDto);

    const savedExample = await this.exampleRepository.findOneById(id);

    if (!savedExample) {
      throw new NotFoundException(`Example with id "${id}" not found`);
    }

    return DtoTransformer.item(ExampleResponseDto, savedExample);
  }

  async remove(id: string): Promise<void> {
    const result = await this.exampleRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Example with id "${id}" not found`);
    }
  }
}
