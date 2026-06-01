import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';

export class CreateUnitDto {
  @ApiProperty({ example: 'Apto 301' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  identifier: string;

  @ApiProperty({
    description:
      'Typology this unit belongs to. The unit inherits its type, base attributes, and base price from the typology.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  typologyId: string;

  @ApiPropertyOptional({
    enum: UnitType,
    description:
      'Optional. If provided, must match the typology unit type. If omitted, the typology unit type is used.',
  })
  @IsEnum(UnitType)
  @IsOptional()
  type?: UnitType;

  @ApiPropertyOptional({
    example: 125000,
    description:
      'Override of the typology base price. If omitted, the typology basePriceUsd is used (and is required to exist).',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceUSD?: number;

  @ApiPropertyOptional({
    description: 'Building ID (required for VERTICAL projects)',
  })
  @IsUUID()
  @IsOptional()
  buildingId?: string | null;

  @ApiPropertyOptional({ example: 3.0, nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  commissionPctOverride?: number | null;

  @ApiPropertyOptional({
    description:
      'Partial overrides applied on top of the typology baseAttributes. Discriminator (type) is always set from the typology.',
    example: {
      floor: 3,
      orientation: 'NORTH',
    },
  })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Corner unit with premium finishes' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  internalNotes?: string | null;
}
