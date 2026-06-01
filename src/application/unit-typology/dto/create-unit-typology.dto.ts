import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';

export class CreateUnitTypologyDto {
  @ApiProperty({ example: 'Tipo A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: UnitType, example: UnitType.APARTMENT })
  @IsEnum(UnitType)
  unitType: UnitType;

  @ApiPropertyOptional({ example: 120000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  basePriceUsd?: number | null;

  @ApiPropertyOptional({
    example: { type: 'APARTMENT', floor: 0, sqm: 85, bedrooms: 2, bathrooms: 2 },
  })
  @IsObject()
  @IsOptional()
  baseAttributes?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Departamento de 2 dormitorios con vista al norte' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string | null;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
