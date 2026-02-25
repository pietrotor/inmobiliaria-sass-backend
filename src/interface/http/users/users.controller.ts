import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Body,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { CreateUserUseCase } from '@application/user/use-cases/create-user.use-case';
import { LoginUserUseCase } from '@application/user/use-cases/login-user.use-case';
import { CheckAuthStatusUseCase } from '@application/user/use-cases/check-auth-status.use-case';
import { UpdateProfileUseCase } from '@application/user/use-cases/update-profile.use-case';
import { ChangePasswordUseCase } from '@application/user/use-cases/change-password.use-case';
import { CreateUserDto } from '@application/user/dto/create-user.dto';
import { LoginUserDto } from '@application/user/dto/login-user.dto';
import { UpdateProfileDto } from '@application/user/dto/update-profile.dto';
import { ChangePasswordDto } from '@application/user/dto/change-password.dto';
import {
  UserResponseDto,
  UserWithTokenResponseDto,
  LoginResponseDto,
} from '@application/user/dto/user-response.dto';
import { Auth, GetUser } from '@interface/http/common';
import { User } from '@domain/user/entities/user.entity';
import {
  StorageService,
  STORAGE_SERVICE,
} from '@domain/common/services/storage.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly checkAuthStatusUseCase: CheckAuthStatusUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    type: UserWithTokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or email already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials or inactive account' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.loginUserUseCase.execute(loginUserDto);
  }

  @Get('me')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user retrieved successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get('auth/check-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token is valid, returns refreshed token',
    type: UserWithTokenResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  checkAuthStatus(@GetUser() user: User) {
    return this.checkAuthStatusUseCase.execute(user);
  }

  @Put('me')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.updateProfileUseCase.execute(user.id, updateProfileDto);
  }

  @Put('me/password')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'Password changed successfully' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Current password is incorrect or new password is invalid' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.changePasswordUseCase.execute(user.id, changePasswordDto);
  }

  @Post('me/avatar')
  @Auth()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Avatar uploaded successfully',
    schema: {
      properties: {
        url: {
          type: 'string',
          example:
            'https://bucket.s3.region.amazonaws.com/users/user-id/avatars/avatar.jpg',
        },
        key: {
          type: 'string',
          example: 'users/user-id/avatars/avatar.jpg',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid file type or size' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const key = this.storageService.generateKey({
      context: 'users',
      entityId: user.id,
      filename: file.originalname,
      subfolder: 'avatars',
    });

    const url = await this.storageService.uploadFile({
      buffer: file.buffer,
      key,
      contentType: file.mimetype,
    });

    return { url, key };
  }
}
