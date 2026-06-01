import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { CommissionStatus } from '@domain/commission/value-objects/commission-status.vo';

export class CommissionFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: CommissionStatus })
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;
}
