import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class UpdateUnitPriceDto {
  @ApiProperty({ example: 130000 })
  @IsNumber()
  @Min(0)
  newPriceUSD: number;

  @ApiProperty({ example: 'Market adjustment Q2 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
