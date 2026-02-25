import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateDeveloperDto {
  @ApiProperty({
    description: 'Organization ID this developer profile belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'Commercial name of the developer',
    example: 'Pacífico S.A.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Legal name of the developer company',
    example: 'Constructora Pacífico S.A.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  legalName: string;

  @ApiProperty({
    description: 'Tax ID (NIT Bolivia)',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxId: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+59171234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contacto@pacifico.com.bo',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
