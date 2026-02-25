import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ProjectVisibility } from '@domain/project/value-objects/project-visibility.vo';
import { ProjectAmenity } from '@domain/project/value-objects/project-amenity.vo';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Edificio Vitrubio',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example:
      'Moderno edificio de 12 pisos en la zona de Calacoto con vista panorámica.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Av. Ballivián #1234',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  neighborhoodId: string;

  @ApiPropertyOptional({
    enum: ProjectVisibility,
    default: ProjectVisibility.PUBLIC,
  })
  @IsEnum(ProjectVisibility)
  @IsOptional()
  visibility?: ProjectVisibility;

  @ApiPropertyOptional({
    example: '2027-06-30T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @ApiPropertyOptional({
    example: 12,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  totalFloors?: number;

  @ApiProperty({
    example: 48,
  })
  @IsInt()
  @Min(0)
  totalUnits: number;

  @ApiPropertyOptional({
    enum: ProjectAmenity,
    isArray: true,
    example: [ProjectAmenity.POOL, ProjectAmenity.GYM, ProjectAmenity.ROOFTOP],
  })
  @IsArray()
  @IsEnum(ProjectAmenity, { each: true })
  @IsOptional()
  amenities?: ProjectAmenity[];

  @ApiProperty({
    example: 2.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultCommissionPct: number;

  @ApiPropertyOptional({
    example: 48,
    default: 48,
  })
  @IsInt()
  @Min(24)
  @Max(168)
  @IsOptional()
  intentDeadlineHours?: number;
}
