import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
  ApiBody,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { CreateProjectUseCase } from '@application/project/use-cases/create-project.use-case';
import { GetProjectUseCase } from '@application/project/use-cases/get-project.use-case';
import { GetProjectsUseCase } from '@application/project/use-cases/get-projects.use-case';
import { GetPublishedProjectsUseCase } from '@application/project/use-cases/get-published-projects.use-case';
import { UpdateProjectUseCase } from '@application/project/use-cases/update-project.use-case';
import { ChangeProjectStatusUseCase } from '@application/project/use-cases/change-project-status.use-case';
import { DeleteProjectUseCase } from '@application/project/use-cases/delete-project.use-case';
import { UploadProjectMediaUseCase } from '@application/project/use-cases/upload-project-media.use-case';
import { DeleteProjectMediaUseCase } from '@application/project/use-cases/delete-project-media.use-case';
import { CreateProjectDto } from '@application/project/dto/create-project.dto';
import { UpdateProjectDto } from '@application/project/dto/update-project.dto';
import {
  ProjectResponseDto,
  PaginatedProjectResponseDto,
  MessageResponseDto,
} from '@application/project/dto/project-response.dto';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';
import { ProjectStatus } from '@domain/project/value-objects/project-status.vo';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly getPublishedProjectsUseCase: GetPublishedProjectsUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly changeProjectStatusUseCase: ChangeProjectStatusUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly uploadProjectMediaUseCase: UploadProjectMediaUseCase,
    private readonly deleteProjectMediaUseCase: DeleteProjectMediaUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Project successfully created in DRAFT status',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  create(@GetUser() user: User, @Body() dto: CreateProjectDto) {
    return this.createProjectUseCase.execute(user.organizationId, dto);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published projects (public)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of published projects',
    type: PaginatedProjectResponseDto,
  })
  findAllPublished(@Query() paginationDto: PaginationDto) {
    return this.getPublishedProjectsUseCase.execute(paginationDto);
  }

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get projects for the authenticated developer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of projects',
    type: PaginatedProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findAll(@GetUser() user: User, @Query() paginationDto: PaginationDto) {
    return this.getProjectsUseCase.execute(
      user.organizationId,
      paginationDto,
    );
  }

  @Get(':id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project details',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findOne(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.getProjectUseCase.execute(user.organizationId, id);
  }

  @Put(':id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project successfully updated',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Invalid input or project is in a terminal state' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  update(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.updateProjectUseCase.execute(user.organizationId, id, dto);
  }

  @Post(':id/media')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media to a project' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'role'],
      properties: {
        file: { type: 'string', format: 'binary' },
        role: {
          type: 'string',
          enum: Object.values(MediaRole),
        },
        sortOrder: { type: 'integer', default: 0 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Media uploaded, returns updated project',
    type: ProjectResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid file or input' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  uploadMedia(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
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

    return this.uploadProjectMediaUseCase.execute(
      user.organizationId,
      id,
      {
        role: body.role,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      },
      file,
    );
  }

  @Delete(':id/media/:mediaId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a media file from a project' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'mediaId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media deleted, returns updated project',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project or media not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  deleteMedia(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.deleteProjectMediaUseCase.execute(
      user.organizationId,
      id,
      mediaId,
    );
  }

  @Patch(':id/status/:status')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change project status (PUBLISHED, PAUSED, CLOSED)' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'status', enum: ProjectStatus })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project status updated',
    type: ProjectResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Invalid status transition' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  changeStatus(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('status') status: ProjectStatus,
  ) {
    return this.changeProjectStatusUseCase.execute(
      user.organizationId,
      id,
      status,
    );
  }

  @Delete(':id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Project deleted',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Cannot delete a published project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  remove(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.deleteProjectUseCase.execute(user.organizationId, id);
  }
}
