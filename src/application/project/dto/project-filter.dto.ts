import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';

export class ProjectFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Text search on name or address' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
