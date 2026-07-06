import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../utils/base/base-pagination';
import { ExampleStatus } from '../../../utils/enums/example.enum';

export class ExampleFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ExampleStatus)
  status?: ExampleStatus;
}