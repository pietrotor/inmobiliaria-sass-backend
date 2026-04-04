import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IntentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() brokerId: string;
  @ApiProperty() projectId: string;
  @ApiProperty() unitIds: string[];
  @ApiProperty() clientName: string;
  @ApiProperty() clientNationalId: string;
  @ApiProperty() clientPhone: string;
  @ApiProperty() status: string;
  @ApiProperty() hasFinancing: boolean;
  @ApiProperty() hasVisited: boolean;
  @ApiProperty() deadlineAt: Date;
  @ApiPropertyOptional() rejectionReason?: string;
  @ApiPropertyOptional() rejectionNote?: string;
  @ApiProperty() createdAt: Date;
}

export class PaginatedIntentResponseDto {
  @ApiProperty({ type: [IntentResponseDto] }) data: IntentResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
}
