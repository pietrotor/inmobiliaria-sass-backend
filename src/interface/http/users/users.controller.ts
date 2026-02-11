import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import { LoginUserUseCase } from '@application/user/use-cases/login-user.use-case';
import { CheckAuthStatusUseCase } from '@application/user/use-cases/check-auth-status.use-case';
import { CreateUserDto } from '@application/user/dto/create-user.dto';
import { LoginUserDto } from '@application/user/dto/login-user.dto';
import { Auth, GetUser } from '@interface/http/common';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly checkAuthStatusUseCase: CheckAuthStatusUseCase,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with the provided information. Passwords are hashed before storage.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
    examples: {
      user: {
        value: {
          name: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '69123456',
          password: 'SecurePass123!',
          roles: ['user'],
        },
      },
      admin: {
        value: {
          name: 'Jane',
          lastName: 'Smith',
          email: 'jane.admin@example.com',
          phoneNumber: '69654321',
          password: 'AdminPass123!',
          roles: ['admin', 'user'],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '69123456',
        roles: ['user'],
        isActive: true,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or email already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email already exists',
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user with email and password. Returns a JWT token valid for 160 hours.',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'User credentials',
    examples: {
      example: {
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '69123456',
          roles: ['user'],
          isActive: true,
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or inactive account',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.loginUserUseCase.execute(loginUserDto);
  }

  @Get('me')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description:
      'Returns the authenticated user information based on the JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '69123456',
        roles: ['user'],
        isActive: true,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get('auth/check-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check authentication status',
    description:
      'Validates the JWT token and returns the current user information with a refreshed token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token is valid',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '69123456',
        roles: ['user'],
        isActive: true,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.checkAuthStatusUseCase.execute(user);
  }
}
