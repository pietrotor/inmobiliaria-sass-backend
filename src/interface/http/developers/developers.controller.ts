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

import { CreateDeveloperUseCase } from '@application/developer/use-cases/create-developer.use-case';
import { GetDeveloperUseCase } from '@application/developer/use-cases/get-developer.use-case';
import { GetDeveloperByOrganizationUseCase } from '@application/developer/use-cases/get-developer-by-organization.use-case';
import { UpdateDeveloperUseCase } from '@application/developer/use-cases/update-developer.use-case';
import { DeleteDeveloperUseCase } from '@application/developer/use-cases/delete-developer.use-case';
import { CreateDeveloperDto } from '@application/developer/dto/create-developer.dto';
import { UpdateDeveloperDto } from '@application/developer/dto/update-developer.dto';
import { DeveloperResponseDto } from '@application/developer/dto/developer-response.dto';
import { Auth } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';

@ApiTags('Developers')
@Controller('developers')
export class DevelopersController {
  constructor(
    private readonly createDeveloperUseCase: CreateDeveloperUseCase,
    private readonly getDeveloperUseCase: GetDeveloperUseCase,
    private readonly getDeveloperByOrganizationUseCase: GetDeveloperByOrganizationUseCase,
    private readonly updateDeveloperUseCase: UpdateDeveloperUseCase,
    private readonly deleteDeveloperUseCase: DeleteDeveloperUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a developer profile' })
  @ApiBody({ type: CreateDeveloperDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Developer profile successfully created',
    type: DeveloperResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or organization already has a developer profile',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.createDeveloperUseCase.execute(createDeveloperDto);
  }

  @Get('organization/:organizationId')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get developer profile by organization' })
  @ApiParam({ name: 'organizationId', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Developer profile details',
    type: DeveloperResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Developer profile not found for this organization' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findByOrganization(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    return this.getDeveloperByOrganizationUseCase.execute(organizationId);
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get developer by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Developer profile details',
    type: DeveloperResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getDeveloperUseCase.execute(id);
  }

  @Put(':id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update developer profile' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDeveloperDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Developer profile successfully updated',
    type: DeveloperResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ) {
    return this.updateDeveloperUseCase.execute(id, updateDeveloperDto);
  }

  @Delete(':id')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete developer profile' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Developer profile deleted',
    schema: {
      properties: {
        message: { type: 'string', example: 'Developer deleted successfully' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid authentication token' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteDeveloperUseCase.execute(id);
  }
}
