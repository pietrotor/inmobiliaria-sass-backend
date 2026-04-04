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

import { CreateUnitUseCase } from '@application/unit/use-cases/create-unit.use-case';
import { GetUnitUseCase } from '@application/unit/use-cases/get-unit.use-case';
import { GetUnitsByProjectUseCase } from '@application/unit/use-cases/get-units-by-project.use-case';
import { UpdateUnitUseCase } from '@application/unit/use-cases/update-unit.use-case';
import { ChangeUnitStatusUseCase } from '@application/unit/use-cases/change-unit-status.use-case';
import { GetUnitPriceHistoryUseCase } from '@application/unit/use-cases/get-unit-price-history.use-case';
import { DeleteUnitUseCase } from '@application/unit/use-cases/delete-unit.use-case';
import { UploadUnitMediaUseCase } from '@application/unit/use-cases/upload-unit-media.use-case';
import { DeleteUnitMediaUseCase } from '@application/unit/use-cases/delete-unit-media.use-case';
import { UpdateUnitPriceUseCase } from '@application/unit/use-cases/update-unit-price.use-case';

import { CreateUnitDto } from '@application/unit/dto/create-unit.dto';
import { UpdateUnitDto } from '@application/unit/dto/update-unit.dto';
import { UpdateUnitPriceDto } from '@application/unit/dto/update-unit-price.dto';
import {
  UnitResponseDto,
  PaginatedUnitResponseDto,
  UnitPriceHistoryResponseDto,
} from '@application/unit/dto/unit-response.dto';
import { UnitFilterDto } from '@application/unit/dto/unit-filter.dto';
import { MessageResponseDto } from '@application/project/dto/project-response.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';
import { UnitStatus } from '@domain/unit/value-objects/unit-status.vo';
import { MediaRole } from '@domain/media/value-objects/media-role.vo';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

@ApiTags('Units')
@Controller('projects/:projectId/units')
export class UnitsController {
  constructor(
    private readonly createUnitUseCase: CreateUnitUseCase,
    private readonly getUnitUseCase: GetUnitUseCase,
    private readonly getUnitsByProjectUseCase: GetUnitsByProjectUseCase,
    private readonly updateUnitUseCase: UpdateUnitUseCase,
    private readonly changeUnitStatusUseCase: ChangeUnitStatusUseCase,
    private readonly getUnitPriceHistoryUseCase: GetUnitPriceHistoryUseCase,
    private readonly deleteUnitUseCase: DeleteUnitUseCase,
    private readonly uploadUnitMediaUseCase: UploadUnitMediaUseCase,
    private readonly deleteUnitMediaUseCase: DeleteUnitMediaUseCase,
    private readonly updateUnitPriceUseCase: UpdateUnitPriceUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new unit in a project' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiBody({ type: CreateUnitDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UnitResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  create(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateUnitDto,
  ) {
    return this.createUnitUseCase.execute(
      user.organizationId,
      projectId,
      dto,
    );
  }

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all units for a project with optional filters' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedUnitResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findAll(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() filterDto: UnitFilterDto,
  ) {
    const { limit, offset, ...filters } = filterDto;
    return this.getUnitsByProjectUseCase.execute(
      user.organizationId,
      projectId,
      limit,
      offset,
      Object.keys(filters).length > 0 ? filters : undefined,
    );
  }

  @Get(':unitId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UnitResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findOne(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
  ) {
    return this.getUnitUseCase.execute(
      user.organizationId,
      projectId,
      unitId,
    );
  }

  @Put(':unitId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update unit' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiBody({ type: UpdateUnitDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UnitResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  update(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Body() dto: UpdateUnitDto,
  ) {
    return this.updateUnitUseCase.execute(
      user.organizationId,
      user.id,
      projectId,
      unitId,
      dto,
    );
  }

  @Patch(':unitId/status/:status')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change unit status' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiParam({ name: 'status', enum: UnitStatus })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UnitResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Invalid status transition' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  changeStatus(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Param('status') status: UnitStatus,
  ) {
    return this.changeUnitStatusUseCase.execute(
      user.organizationId,
      projectId,
      unitId,
      status,
    );
  }

  @Get(':unitId/price-history')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unit price change history' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UnitPriceHistoryResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  getPriceHistory(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
  ) {
    return this.getUnitPriceHistoryUseCase.execute(
      user.organizationId,
      projectId,
      unitId,
    );
  }

  @Patch(':unitId/price')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update unit price with history tracking' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiBody({ type: UpdateUnitPriceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UnitResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  updatePrice(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Body() dto: UpdateUnitPriceDto,
  ) {
    return this.updateUnitPriceUseCase.execute(
      user.organizationId,
      user.id,
      projectId,
      unitId,
      dto,
    );
  }

  @Post(':unitId/media')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media to a unit' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
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
    type: UnitResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid file or input' })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  uploadMedia(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
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

    return this.uploadUnitMediaUseCase.execute(
      user.organizationId,
      projectId,
      unitId,
      {
        role: body.role,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
      },
      file,
    );
  }

  @Delete(':unitId/media/:mediaId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a media file from a unit' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiParam({ name: 'mediaId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UnitResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Unit or media not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  deleteMedia(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.deleteUnitMediaUseCase.execute(
      user.organizationId,
      projectId,
      unitId,
      mediaId,
    );
  }

  @Delete(':unitId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete unit' })
  @ApiParam({ name: 'projectId', type: String })
  @ApiParam({ name: 'unitId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  @ApiForbiddenResponse({ description: 'You do not have access to this project' })
  @ApiBadRequestResponse({ description: 'Cannot delete a unit with active interest' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  remove(
    @GetUser() user: User,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('unitId', ParseUUIDPipe) unitId: string,
  ) {
    return this.deleteUnitUseCase.execute(
      user.organizationId,
      projectId,
      unitId,
    );
  }
}
