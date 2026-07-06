import { Expose } from "class-transformer";

export class ExampleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;
  
  @Expose()
  updatedAt: Date;
}