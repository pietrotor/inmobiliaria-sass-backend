import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateOrganizationUseCase } from '@application/organization/use-cases/create-organization.use-case';
import { GetOrganizationsUseCase } from '@application/organization/use-cases/get-organizations.use-case';
import { GetOrganizationUseCase } from '@application/organization/use-cases/get-organization.use-case';
import { UpdateOrganizationUseCase } from '@application/organization/use-cases/update-organization.use-case';
import { DeleteOrganizationUseCase } from '@application/organization/use-cases/delete-organization.use-case';
import { CreateOrganizationDto } from '@application/organization/dto/create-organization.dto';
import { UpdateOrganizationDto } from '@application/organization/dto/update-organization.dto';
import { OrganizationResponseDto } from '@application/organization/dto/organization-response.dto';
import { Auth } from '@interface/http/common';
import { Role } from '@domain/user/value-objects/role.vo';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly getOrganizationsUseCase: GetOrganizationsUseCase,
    private readonly getOrganizationUseCase: GetOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
  ) {}

  @Post()
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Organization successfully created',
    type: OrganizationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input or organization email already exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.createOrganizationUseCase.execute(createOrganizationDto);
  }

  @Get()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organizations',
    type: [OrganizationResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findAll() {
    return this.getOrganizationsUseCase.execute();
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization details',
    type: OrganizationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getOrganizationUseCase.execute(id);
  }

  @Put(':id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update organization' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization successfully updated',
    type: OrganizationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiBadRequestResponse({ description: 'Invalid input or organization email already exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.updateOrganizationUseCase.execute(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete organization (soft delete)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization successfully deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'Organization deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteOrganizationUseCase.execute(id);
  }
}
