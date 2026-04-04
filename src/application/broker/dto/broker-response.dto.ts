import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrokerResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() plan: string;
  @ApiProperty() status: string;
  @ApiPropertyOptional() companyName?: string;
  @ApiPropertyOptional() licenseNumber?: string;
  @ApiProperty() cancellationsLast30Days: number;
  @ApiProperty() createdAt: Date;
}

export class BrokerWithAccessDto extends BrokerResponseDto {
  @ApiProperty() projectAccessStatus: string;
}
