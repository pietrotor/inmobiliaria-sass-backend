import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { PostSaleRequestType } from '@domain/post-sale/value-objects/request-type.vo';

export class CreatePostSaleRequestDto {
  @ApiProperty()
  @IsUUID()
  unitId: string;

  @ApiProperty()
  @IsUUID()
  reservationId: string;

  @ApiProperty({ enum: PostSaleRequestType })
  @IsEnum(PostSaleRequestType)
  requestType: PostSaleRequestType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedToUserId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  resolutionDeadline?: string;
}
