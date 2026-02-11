import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ description: 'Country name', example: 'Venezuela' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 code',
    example: 'VE',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;
}
