import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiPropertyOptional({ example: 'Market adjustment Q2 2026' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  priceChangeReason?: string;
}
