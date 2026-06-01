import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { PostSaleRequestStatus } from '@domain/post-sale/value-objects/request-status.vo';
import { PostSaleRequestType } from '@domain/post-sale/value-objects/request-type.vo';

export class PostSaleFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PostSaleRequestStatus })
  @IsOptional()
  @IsEnum(PostSaleRequestStatus)
  status?: PostSaleRequestStatus;

  @ApiPropertyOptional({ enum: PostSaleRequestType })
  @IsOptional()
  @IsEnum(PostSaleRequestType)
  requestType?: PostSaleRequestType;
}
