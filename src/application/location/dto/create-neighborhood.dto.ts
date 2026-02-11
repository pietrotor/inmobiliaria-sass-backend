import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateNeighborhoodDto {
  @ApiProperty({ description: 'Neighborhood name', example: 'Las Mercedes' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'City ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cityId: string;
}
