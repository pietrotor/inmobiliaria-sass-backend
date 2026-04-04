import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateUnitPriceDto {
  @ApiProperty({ example: 135000 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  newPriceUSD: number;

  @ApiPropertyOptional({ example: 'Market adjustment Q2 2026' })
  @IsOptional()
  @IsString()
  reason?: string;
}
