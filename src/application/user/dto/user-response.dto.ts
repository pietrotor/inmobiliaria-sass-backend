import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@domain/user/value-objects/role.vo';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'John' })
  name: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '69123456' })
  phoneNumber: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  organizationId: string;

  @ApiProperty({ enum: Role, isArray: true, example: [Role.USER] })
  roles: Role[];

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UserWithTokenResponseDto extends UserResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;
}
