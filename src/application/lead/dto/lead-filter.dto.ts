import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { LeadStatus } from '@domain/lead/value-objects/lead-status.vo';

export class LeadFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedExecutiveId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiPropertyOptional({ description: 'Search by full name or phone' })
  @IsOptional()
  @IsString()
  search?: string;
}
