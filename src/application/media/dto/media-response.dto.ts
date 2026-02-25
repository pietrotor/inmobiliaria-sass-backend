import { ApiProperty } from '@nestjs/swagger';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaType } from '@domain/media/value-objects/media-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';

export class MediaResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ enum: EntityType, example: EntityType.PROJECT })
  entityType: EntityType;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  entityId: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  mediaType: MediaType;

  @ApiProperty({ enum: MediaRole, example: MediaRole.COVER })
  role: MediaRole;

  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/projects/cover.jpg' })
  url: string;

  @ApiProperty({ example: 'projects/550e8400/cover.jpg' })
  key: string;

  @ApiProperty({ example: 'cover.jpg' })
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType: string;

  @ApiProperty({ example: 204800 })
  size: number;

  @ApiProperty({ example: 0 })
  sortOrder: number;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;
}
