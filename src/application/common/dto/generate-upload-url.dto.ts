import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const ALLOWED_CONTEXTS = [
  'developers',
  'projects',
  'units',
  'brokers',
  'quotes',
  'users',
] as const;

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'video/webm',
] as const;

export class GenerateUploadUrlDto {
  @ApiProperty({
    description: 'Original filename with extension',
    example: 'cover-photo.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file to upload',
    example: 'image/jpeg',
    enum: ALLOWED_CONTENT_TYPES,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_CONTENT_TYPES, {
    message: `contentType must be one of: ${ALLOWED_CONTENT_TYPES.join(', ')}`,
  })
  contentType: string;

  @ApiProperty({
    description: 'Resource context for organizing files in storage',
    example: 'projects',
    enum: ALLOWED_CONTEXTS,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_CONTEXTS, {
    message: `context must be one of: ${ALLOWED_CONTEXTS.join(', ')}`,
  })
  context: string;

  @ApiProperty({
    description: 'ID of the entity the file belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiPropertyOptional({
    description: 'Subfolder within the entity context (e.g. images, brochures, floor-plans)',
    example: 'images',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  subfolder?: string;
}
