import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ExampleService } from './example.service';
import { ExampleFilterDto } from './dto/filter-example.dto';
import { PaginatedResponseInterceptor } from '../../utils/interceptor/paginated-response.interceptor';
import { ResponseInterceptor } from '../../utils/interceptor/response.interceptor';

@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @UseInterceptors(ResponseInterceptor)
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Get()
  @UseInterceptors(PaginatedResponseInterceptor)
  findAll(
    @Query() filter: ExampleFilterDto,
  ) {
    return this.exampleService.findAll(filter);
  }

  @Get(':id')
  @UseInterceptors(ResponseInterceptor)
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ResponseInterceptor)
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(id, updateExampleDto);
  }

  @Delete(':id')
  @UseInterceptors(ResponseInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.exampleService.remove(id);
  }
}
