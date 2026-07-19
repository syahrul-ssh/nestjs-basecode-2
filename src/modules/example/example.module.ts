import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from '../../entities/example.entity';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { ExampleFilter } from './exmaple.filter';
import { ExamplesRepository } from './example.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService, ExampleFilter, ExamplesRepository],
})
export class ExampleModule {}
