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
  @ApiOperation({
    summary: 'Create a new organization',
    description:
      'Creates a new organization. Only accessible by ADMIN or SUPER_USER roles.',
  })
  @ApiBody({
    type: CreateOrganizationDto,
    description: 'Organization data',
    examples: {
      example: {
        value: {
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1234567890',
          address: '123 Main St, City, Country',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Organization successfully created',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or organization email already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Organization email already exists',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid authentication token',
  })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.createOrganizationUseCase.execute(createOrganizationDto);
  }

  @Get()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all organizations',
    description: 'Retrieves a list of all organizations.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organizations',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1234567890',
          address: '123 Main St, City, Country',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid authentication token',
  })
  findAll() {
    return this.getOrganizationsUseCase.execute();
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Retrieves a specific organization by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization UUID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization details',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
    schema: {
      example: {
        statusCode: 404,
        message:
          "Organization with identifier '123e4567-e89b-12d3-a456-426614174000' not found",
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid authentication token',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getOrganizationUseCase.execute(id);
  }

  @Put(':id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update organization',
    description:
      'Updates an existing organization. Only accessible by ADMIN or SUPER_USER roles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization UUID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateOrganizationDto,
    description: 'Updated organization data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization successfully updated',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Acme Corporation Updated',
        email: 'contact@acme.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or organization email already exists',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid authentication token',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.updateOrganizationUseCase.execute(id, updateOrganizationDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN, Role.SUPER_USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete organization (soft delete)',
    description:
      'Soft deletes an organization. Only accessible by ADMIN or SUPER_USER roles.',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization UUID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization successfully deleted',
    schema: {
      example: {
        message: 'Organization deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Organization not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid authentication token',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteOrganizationUseCase.execute(id);
  }
}
