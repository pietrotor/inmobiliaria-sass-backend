import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { ReservationStatus } from '@domain/reservation/value-objects/reservation-status.vo';

export class ReservationFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by client name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
