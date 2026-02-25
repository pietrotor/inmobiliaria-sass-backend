import { ApiProperty } from '@nestjs/swagger';

export class DeveloperResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  organizationId: string;

  @ApiProperty({ example: 'Pacífico S.A.' })
  name: string;

  @ApiProperty({ example: 'Constructora Pacífico S.A.' })
  legalName: string;

  @ApiProperty({ example: '1234567890' })
  taxId: string;

  @ApiProperty({ example: '+59171234567' })
  phone: string;

  @ApiProperty({ example: 'contacto@pacifico.com.bo' })
  email: string;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-25T12:00:00.000Z' })
  updatedAt: Date;
}
