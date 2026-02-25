import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_OFFSET,
} from '@domain/common/constants/pagination.constants';

export class PaginationDto {
  @ApiProperty({
    default: PAGINATION_DEFAULT_LIMIT,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: PAGINATION_DEFAULT_OFFSET,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
