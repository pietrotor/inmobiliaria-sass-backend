import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
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

  @ApiPropertyOptional({
    type: [String],
    example: ['Balcón', 'Parrillero', 'Dormitorio con suite', 'Vista panorámica'],
    description:
      'Free-form features. There is no fixed catalog — anything that describes the unit (amenities, finishes, perks) goes here as a short label.',
  })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  customTags?: string[];
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

  @ApiPropertyOptional({ type: [String], example: ['Cerca del ascensor'] })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  customTags?: string[];
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

  @ApiPropertyOptional({ type: [String], example: ['Climatizado'] })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  customTags?: string[];
}
