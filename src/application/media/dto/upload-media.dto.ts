import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsInt, IsUUID, Min } from 'class-validator';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';

export class UploadMediaDto {
  @ApiProperty({
    description: 'Type of entity this media belongs to',
    enum: EntityType,
    example: EntityType.PROJECT,
  })
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @ApiProperty({
    description: 'UUID of the entity this media belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({
    description: 'Role of this media within the entity',
    enum: MediaRole,
    example: MediaRole.GALLERY,
  })
  @IsEnum(MediaRole)
  @IsNotEmpty()
  role: MediaRole;

  @ApiProperty({
    description: 'Sort order for gallery/collection media',
    example: 0,
    default: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
