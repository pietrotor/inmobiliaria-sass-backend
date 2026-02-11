import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ description: 'City name', example: 'Caracas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  countryId: string;
}
