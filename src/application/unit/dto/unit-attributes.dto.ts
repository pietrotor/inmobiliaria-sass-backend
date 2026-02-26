import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { Orientation } from '@domain/unit/value-objects/orientation.vo';

export class HabitableUnitAttributesDto {
  @ApiProperty({ enum: ['APARTMENT', 'OFFICE', 'COMMERCIAL'] })
  @IsEnum(['APARTMENT', 'OFFICE', 'COMMERCIAL'])
  type: 'APARTMENT' | 'OFFICE' | 'COMMERCIAL';

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  floor: number;

  @ApiProperty({ example: 85.5 })
  @IsNumber()
  @Min(0)
  sqm: number;

  @ApiPropertyOptional({ example: 72.0, nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  sqmUsable?: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  bedrooms?: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  bathrooms?: number | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  halfBathrooms?: number | null;

  @ApiPropertyOptional({ enum: Orientation, nullable: true })
  @IsEnum(Orientation)
  @IsOptional()
  orientation?: Orientation | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasBalcony: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  hasLaundryRoom: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  hasServantRoom: boolean;
}

export class ParkingAttributesDto {
  @ApiProperty({ enum: ['PARKING'] })
  @IsEnum(['PARKING'])
  type: 'PARKING';

  @ApiProperty({ example: 'S1' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ example: 'E-04' })
  @IsString()
  @IsNotEmpty()
  spotNumber: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCovered: boolean;

  @ApiPropertyOptional({ example: 12.5, nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  sqm?: number | null;
}

export class StorageAttributesDto {
  @ApiProperty({ enum: ['STORAGE'] })
  @IsEnum(['STORAGE'])
  type: 'STORAGE';

  @ApiPropertyOptional({ example: 'S2', nullable: true })
  @IsString()
  @IsOptional()
  level?: string | null;

  @ApiPropertyOptional({ example: 4.0, nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  sqm?: number | null;
}
