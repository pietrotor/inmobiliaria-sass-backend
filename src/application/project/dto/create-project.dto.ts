import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
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
import { ProjectType } from '@domain/project/value-objects/project-type.vo';
import { ProjectAmenity } from '@domain/project/value-objects/project-amenity.vo';
import { ConstructionPhase } from '@domain/project/value-objects/construction-phase.vo';

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

  @ApiPropertyOptional({
    enum: ProjectType,
    default: ProjectType.VERTICAL,
  })
  @IsEnum(ProjectType)
  @IsOptional()
  projectType?: ProjectType;

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
    example: -16.5,
    description: 'Latitude in decimal degrees (-90 to 90)',
  })
  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    example: -68.15,
    description: 'Longitude in decimal degrees (-180 to 180)',
  })
  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    enum: ProjectVisibility,
    default: ProjectVisibility.PUBLIC,
  })
  @IsEnum(ProjectVisibility)
  @IsOptional()
  visibility?: ProjectVisibility;

  @ApiPropertyOptional({
    enum: ConstructionPhase,
    default: ConstructionPhase.PRE_LAUNCH,
  })
  @IsEnum(ConstructionPhase)
  @IsOptional()
  constructionPhase?: ConstructionPhase;

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

  @ApiPropertyOptional({
    enum: ProjectAmenity,
    isArray: true,
    example: [ProjectAmenity.POOL, ProjectAmenity.GYM, ProjectAmenity.ROOFTOP],
  })
  @IsArray()
  @IsEnum(ProjectAmenity, { each: true })
  @IsOptional()
  amenities?: ProjectAmenity[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Sala de cine', 'Cancha de pádel'],
    description: 'Custom (free-form) amenity names not in the predefined enum',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @IsOptional()
  customAmenities?: string[];

  @ApiPropertyOptional({
    example: 2.5,
    default: 2.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  defaultCommissionPct?: number;

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
