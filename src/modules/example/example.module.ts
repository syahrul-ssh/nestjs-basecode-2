import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from '../../entities/example.entity';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { ExampleFilter } from './exmaple.filter';

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService, ExampleFilter],
})
export class ExampleModule {}
