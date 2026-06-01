import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UploadMediaUseCase } from '@application/media/use-cases/upload-media.use-case';
import { GetMediaByEntityUseCase } from '@application/media/use-cases/get-media-by-entity.use-case';
import { DeleteMediaUseCase } from '@application/media/use-cases/delete-media.use-case';
import { DeleteMediaByEntityUseCase } from '@application/media/use-cases/delete-media-by-entity.use-case';
import { MediaResponseDto } from '@application/media/dto/media-response.dto';
import { EntityType } from '@domain/media/value-objects/entity-type.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { Auth } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly uploadMediaUseCase: UploadMediaUseCase,
    private readonly getMediaByEntityUseCase: GetMediaByEntityUseCase,
    private readonly deleteMediaUseCase: DeleteMediaUseCase,
    private readonly deleteMediaByEntityUseCase: DeleteMediaByEntityUseCase,
  ) {}

  @Post('upload')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media file' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'entityType', 'entityId', 'role'],
      properties: {
        file: { type: 'string', format: 'binary' },
        entityType: { type: 'string', enum: Object.values(EntityType) },
        entityId: { type: 'string', format: 'uuid' },
        role: { type: 'string', enum: Object.values(MediaRole) },
        sortOrder: { type: 'integer', default: 0 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Media uploaded successfully',
    type: MediaResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid file or input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE })],
      }),
    )
    file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.uploadMediaUseCase.execute(
      {
        entityType: body.entityType,
        entityId: body.entityId,
        role: body.role,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      },
      file,
    );
  }

  @Get(':entityType/:entityId')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get media by entity' })
  @ApiParam({ name: 'entityType', enum: EntityType })
  @ApiParam({ name: 'entityId', type: String })
  @ApiQuery({ name: 'role', enum: MediaRole, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of media',
    type: [MediaResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findByEntity(
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Query('role') role?: MediaRole,
  ) {
    return this.getMediaByEntityUseCase.execute(entityType, entityId, role);
  }

  @Delete(':id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a media file' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'Media deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Media not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteMediaUseCase.execute(id);
  }

  @Delete(':entityType/:entityId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete all media for an entity' })
  @ApiParam({ name: 'entityType', enum: EntityType })
  @ApiParam({ name: 'entityId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All media deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'All media deleted successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  removeAllByEntity(
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseUUIDPipe) entityId: string,
  ) {
    return this.deleteMediaByEntityUseCase.execute(entityType, entityId);
  }
}
