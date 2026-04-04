import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostSaleRequestResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() unitId: string;
  @ApiProperty() reservationId: string;
  @ApiProperty() requestType: string;
  @ApiProperty() description: string;
  @ApiProperty() status: string;
  @ApiPropertyOptional() assignedToUserId?: string;
  @ApiPropertyOptional() processNotes?: string;
  @ApiProperty() registrationDate: Date;
  @ApiPropertyOptional() closingDate?: Date;
  @ApiProperty() createdAt: Date;
}

export class PaginatedPostSaleResponseDto {
  @ApiProperty({ type: [PostSaleRequestResponseDto] })
  data: PostSaleRequestResponseDto[];

  @ApiProperty() total: number;
  @ApiProperty() limit: number;
  @ApiProperty() offset: number;
}
