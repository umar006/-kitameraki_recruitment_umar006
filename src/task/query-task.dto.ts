import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryTaskDto {
  @IsOptional()
  @Transform(({ value }) => (Number(value) ? Number(value) : 1))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (Number(value) ? Number(value) : 10))
  limit?: number;
}
