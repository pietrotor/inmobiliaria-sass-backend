import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LeadResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() developerId: string;
  @ApiPropertyOptional() assignedExecutiveId: string | null;
  @ApiProperty() fullName: string;
  @ApiProperty() nationalId: string;
  @ApiProperty() phone: string;
  @ApiPropertyOptional() email?: string;
  @ApiProperty() source: string;
  @ApiProperty() status: string;
  @ApiProperty() interestedUnitIds: string[];
  @ApiPropertyOptional() notes?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class DuplicateAlertDto {
  @ApiProperty() isDuplicate: boolean;
  @ApiPropertyOptional() existingLeadId?: string;
  @ApiPropertyOptional() existingIntentBrokerId?: string;
  @ApiPropertyOptional() message?: string;
}

export class LeadWithDuplicateAlertDto extends LeadResponseDto {
  @ApiPropertyOptional({ type: DuplicateAlertDto })
  duplicateAlert?: DuplicateAlertDto;
}

export class PaginatedLeadResponseDto {
  @ApiProperty({ type: [LeadResponseDto] }) data: LeadResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
}
