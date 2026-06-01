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

import { CreateBuildingUseCase } from '@application/building/use-cases/create-building.use-case';
import { GetBuildingsUseCase } from '@application/building/use-cases/get-buildings.use-case';
import { UpdateBuildingUseCase } from '@application/building/use-cases/update-building.use-case';
import { DeleteBuildingUseCase } from '@application/building/use-cases/delete-building.use-case';

import { CreateBuildingDto } from '@application/building/dto/create-building.dto';
import { UpdateBuildingDto } from '@application/building/dto/update-building.dto';
import { BuildingResponseDto } from '@application/building/dto/building-response.dto';
import { MessageResponseDto } from '@application/project/dto/project-response.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Buildings')
@Controller('projects/:projectId/buildings')
export class BuildingsController {
  constructor(
    private readonly createBuildingUseCase: CreateBuildingUseCase,
    private readonly getBuildingsUseCase: GetBuildingsUseCase,
    private readonly updateBuildingUseCase: UpdateBuildingUseCase,
    private readonly deleteBuildingUseCase: DeleteBuildingUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a building for a project' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, type: BuildingResponseDto })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateBuildingDto,
    @GetUser() user: User,
  ) {
    return this.createBuildingUseCase.execute(
      user.organizationId,
      projectId,
      dto,
    );
  }

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all buildings of a project' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: [BuildingResponseDto] })
  findAll(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @GetUser() user: User,
  ) {
    return this.getBuildingsUseCase.execute(user.organizationId, projectId);
  }

  @Put(':buildingId')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a building' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'buildingId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: BuildingResponseDto })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @Body() dto: UpdateBuildingDto,
    @GetUser() user: User,
  ) {
    return this.updateBuildingUseCase.execute(
      user.organizationId,
      projectId,
      buildingId,
      dto,
    );
  }

  @Delete(':buildingId')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a building' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'buildingId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
    @GetUser() user: User,
  ) {
    return this.deleteBuildingUseCase.execute(
      user.organizationId,
      projectId,
      buildingId,
    );
  }
}
