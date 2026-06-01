import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { CreateUnitTypologyUseCase } from '@application/unit-typology/use-cases/create-unit-typology.use-case';
import { GetUnitTypologiesUseCase } from '@application/unit-typology/use-cases/get-unit-typologies.use-case';
import { UpdateUnitTypologyUseCase } from '@application/unit-typology/use-cases/update-unit-typology.use-case';
import { DeleteUnitTypologyUseCase } from '@application/unit-typology/use-cases/delete-unit-typology.use-case';

import { CreateUnitTypologyDto } from '@application/unit-typology/dto/create-unit-typology.dto';
import { UpdateUnitTypologyDto } from '@application/unit-typology/dto/update-unit-typology.dto';
import { UnitTypologyResponseDto } from '@application/unit-typology/dto/unit-typology-response.dto';
import { MessageResponseDto } from '@application/project/dto/project-response.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Unit Typologies')
@Controller('projects/:projectId/typologies')
export class UnitTypologiesController {
  constructor(
    private readonly createUnitTypologyUseCase: CreateUnitTypologyUseCase,
    private readonly getUnitTypologiesUseCase: GetUnitTypologiesUseCase,
    private readonly updateUnitTypologyUseCase: UpdateUnitTypologyUseCase,
    private readonly deleteUnitTypologyUseCase: DeleteUnitTypologyUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a unit typology for a project' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, type: UnitTypologyResponseDto })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateUnitTypologyDto,
    @GetUser() user: User,
  ) {
    return this.createUnitTypologyUseCase.execute(
      user.organizationId,
      projectId,
      dto,
    );
  }

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all typologies of a project' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: [UnitTypologyResponseDto] })
  findAll(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @GetUser() user: User,
  ) {
    return this.getUnitTypologiesUseCase.execute(
      user.organizationId,
      projectId,
    );
  }

  @Put(':typologyId')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a unit typology' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'typologyId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: UnitTypologyResponseDto })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('typologyId', ParseUUIDPipe) typologyId: string,
    @Body() dto: UpdateUnitTypologyDto,
    @GetUser() user: User,
  ) {
    return this.updateUnitTypologyUseCase.execute(
      user.organizationId,
      projectId,
      typologyId,
      dto,
    );
  }

  @Delete(':typologyId')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a unit typology' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'typologyId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('typologyId', ParseUUIDPipe) typologyId: string,
    @GetUser() user: User,
  ) {
    return this.deleteUnitTypologyUseCase.execute(
      user.organizationId,
      projectId,
      typologyId,
    );
  }
}
