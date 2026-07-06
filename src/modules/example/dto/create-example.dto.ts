import { IsEnum, IsString } from "class-validator";
import { ExampleStatus } from "src/utils/enums/example.enum";

export class CreateExampleDto {
  @IsString()
  name: string;

  @IsEnum(ExampleStatus)
  status: ExampleStatus;
}
