import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';
import { ProjectVisibility } from '@domain/project/value-objects/project-visibility.vo';
import { ProjectAmenity } from '@domain/project/value-objects/project-amenity.vo';
import { MediaResponseDto } from '@application/media/dto/media-response.dto';

export class ProjectResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  developerId: string;

  @ApiProperty({ example: 'Edificio Vitrubio' })
  name: string;

  @ApiPropertyOptional({
    example: 'Moderno edificio de 12 pisos con vista panorámica.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 'Av. Ballivián #1234' })
  address: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  countryId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
  cityId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440004' })
  neighborhoodId: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.DRAFT })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectVisibility, example: ProjectVisibility.PUBLIC })
  visibility: ProjectVisibility;

  @ApiPropertyOptional({
    example: '2027-06-30T00:00:00.000Z',
    nullable: true,
  })
  deliveryDate: Date | null;

  @ApiPropertyOptional({ example: 12, nullable: true })
  totalFloors: number | null;

  @ApiProperty({ example: 48 })
  totalUnits: number;

  @ApiProperty({
    enum: ProjectAmenity,
    isArray: true,
    example: [ProjectAmenity.POOL, ProjectAmenity.GYM],
  })
  amenities: ProjectAmenity[];

  @ApiProperty({ example: 2.5 })
  defaultCommissionPct: number;

  @ApiProperty({ example: 48 })
  intentDeadlineHours: number;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({
    example: '2026-03-01T10:00:00.000Z',
    nullable: true,
  })
  publishedAt: Date | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  closedAt: Date | null;

  @ApiPropertyOptional({ type: MediaResponseDto, nullable: true })
  coverImage: MediaResponseDto | null;

  @ApiProperty({ type: [MediaResponseDto] })
  media: MediaResponseDto[];
}

export class PaginatedProjectResponseDto {
  @ApiProperty({ type: [ProjectResponseDto] })
  data: ProjectResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Project deleted successfully' })
  message: string;
}
