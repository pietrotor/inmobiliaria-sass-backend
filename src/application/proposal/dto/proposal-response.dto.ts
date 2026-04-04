import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProposalResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() type: string;
  @ApiPropertyOptional() brokerId?: string;
  @ApiPropertyOptional() executiveId?: string;
  @ApiProperty() developerId: string;
  @ApiProperty() clientName: string;
  @ApiProperty() clientNationalId: string;
  @ApiProperty() clientPhone: string;
  @ApiProperty() units: any[];
  @ApiProperty() totalPriceUSD: number;
  @ApiProperty() estimatedCommissionUSD: number;
  @ApiProperty() generatedAt: Date;
  @ApiProperty() validUntil: Date;
}
