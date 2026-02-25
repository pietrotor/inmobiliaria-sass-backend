import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { Auth, GetUser } from '@interface/http/common';
import { Role } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';
import { S3Service } from '@infrastructure/storage/s3/s3.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = /^image\/(jpeg|jpg|png|webp|gif)$/;

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @Auth(Role.ADMIN, Role.USER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a file to S3',
    description:
      'Uploads a file (image) to S3 storage. Max 5MB. Supported formats: jpg, png, webp, gif. Returns the public URL.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (max 5MB, jpg/png/webp/gif)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded successfully',
    schema: {
      example: {
        url: 'https://bucket.s3.region.amazonaws.com/org-id/files/uuid.jpg',
        key: 'org-id/files/uuid.jpg',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid file type or size' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: ALLOWED_MIME_TYPES }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const key = this.s3Service.generateKey(
      user.organizationId,
      'organization',
      'files',
      file.originalname,
    );

    const url = await this.s3Service.uploadFile(
      file.buffer,
      key,
      file.mimetype,
    );

    return { url, key };
  }
}
