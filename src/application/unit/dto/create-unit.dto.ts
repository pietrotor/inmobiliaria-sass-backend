import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { UnitAttributes } from '@domain/unit/value-objects/unit-attributes.vo';

export class CreateUnitDto {
  @ApiProperty({ example: 'Apto 301' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  identifier: string;

  @ApiProperty({ enum: UnitType, example: UnitType.APARTMENT })
  @IsEnum(UnitType)
  type: UnitType;

  @ApiProperty({ example: 125000 })
  @IsNumber()
  @Min(0)
  priceUSD: number;

  @ApiPropertyOptional({ example: 3.0, nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  commissionPctOverride?: number | null;

  @ApiProperty({
    description: 'Discriminated union based on unit type',
    example: {
      type: 'APARTMENT',
      floor: 3,
      sqm: 85.5,
      sqmUsable: 72.0,
      bedrooms: 2,
      bathrooms: 2,
      halfBathrooms: 1,
      orientation: 'NORTH',
      hasBalcony: true,
      hasLaundryRoom: false,
      hasServantRoom: false,
    },
  })
  @IsObject()
  @IsNotEmpty()
  attributes: UnitAttributes;

  @ApiPropertyOptional({ example: 'Corner unit with premium finishes' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  internalNotes?: string | null;
}
