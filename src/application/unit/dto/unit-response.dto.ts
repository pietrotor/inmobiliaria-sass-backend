import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { UnitType } from '@domain/unit/value-objects/unit-type.vo';
import { MediaResponseDto } from '@application/media/dto/media-response.dto';

export class UnitResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  projectId: string;

  @ApiPropertyOptional({ nullable: true })
  buildingId: string | null;

  @ApiPropertyOptional({ nullable: true })
  typologyId: string | null;

  @ApiProperty({ example: 'Apto 301' })
  identifier: string;

  @ApiProperty({ enum: UnitType, example: UnitType.APARTMENT })
  type: UnitType;

  @ApiProperty({ enum: UnitStatus, example: UnitStatus.AVAILABLE })
  status: UnitStatus;

  @ApiProperty({ example: 125000 })
  priceUSD: number;

  @ApiPropertyOptional({ example: 3.0, nullable: true })
  commissionPctOverride: number | null;

  @ApiProperty({
    example: {
      type: 'APARTMENT',
      floor: 3,
      sqm: 85.5,
      sqmUsable: 72.0,
      bedrooms: 2,
      bathrooms: 2,
      halfBathrooms: 1,
      orientation: 'NORTH',
      customTags: ['Balcón', 'Vestidor', 'Suite master', 'Jacuzzi privado', 'Vista panorámica'],
    },
  })
  attributes: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Corner unit with premium finishes', nullable: true })
  internalNotes: string | null;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: MediaResponseDto, nullable: true })
  coverImage: MediaResponseDto | null;

  @ApiProperty({ type: [MediaResponseDto] })
  media: MediaResponseDto[];
}

export class PaginatedUnitResponseDto {
  @ApiProperty({ type: [UnitResponseDto] })
  data: UnitResponseDto[];

  @ApiProperty({ example: 48 })
  total: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;
}

export class UnitPriceHistoryResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  unitId: string;

  @ApiProperty({ example: 125000 })
  previousPriceUSD: number;

  @ApiProperty({ example: 130000 })
  newPriceUSD: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  changedByUserId: string;

  @ApiProperty({ example: 'Market adjustment Q2 2026' })
  reason: string;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;
}
