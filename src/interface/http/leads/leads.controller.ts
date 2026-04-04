import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { CreateLeadUseCase } from '@application/lead/use-cases/create-lead.use-case';
import { GetLeadsUseCase } from '@application/lead/use-cases/get-leads.use-case';
import { GetLeadUseCase } from '@application/lead/use-cases/get-lead.use-case';
import { UpdateLeadUseCase } from '@application/lead/use-cases/update-lead.use-case';
import { AdvanceLeadStatusUseCase } from '@application/lead/use-cases/advance-lead-status.use-case';
import { AssignLeadUseCase } from '@application/lead/use-cases/assign-lead.use-case';
import { GetLeadHistoryUseCase } from '@application/lead/use-cases/get-lead-history.use-case';

import { CreateLeadDto } from '@application/lead/dto/create-lead.dto';
import { UpdateLeadDto } from '@application/lead/dto/update-lead.dto';
import { AdvanceLeadStatusDto } from '@application/lead/dto/advance-lead-status.dto';
import { LeadFilterDto } from '@application/lead/dto/lead-filter.dto';
import {
  LeadResponseDto,
  PaginatedLeadResponseDto,
  LeadWithDuplicateAlertDto,
} from '@application/lead/dto/lead-response.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly createLeadUseCase: CreateLeadUseCase,
    private readonly getLeadsUseCase: GetLeadsUseCase,
    private readonly getLeadUseCase: GetLeadUseCase,
    private readonly updateLeadUseCase: UpdateLeadUseCase,
    private readonly advanceLeadStatusUseCase: AdvanceLeadStatusUseCase,
    private readonly assignLeadUseCase: AssignLeadUseCase,
    private readonly getLeadHistoryUseCase: GetLeadHistoryUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new lead with duplicate detection' })
  @ApiResponse({ status: HttpStatus.CREATED, type: LeadWithDuplicateAlertDto })
  create(@GetUser() user: User, @Body() dto: CreateLeadDto) {
    return this.createLeadUseCase.execute(user.organizationId, dto);
  }

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get leads for the developer (filtered)' })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedLeadResponseDto })
  findAll(@GetUser() user: User, @Query() filterDto: LeadFilterDto) {
    const { limit, offset, ...filters } = filterDto;
    return this.getLeadsUseCase.execute(
      user.organizationId,
      limit,
      offset,
      Object.keys(filters).length > 0 ? filters : undefined,
    );
  }

  @Get(':leadId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiParam({ name: 'leadId', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: LeadResponseDto })
  findOne(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.getLeadUseCase.execute(leadId);
  }

  @Put(':leadId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lead information' })
  @ApiParam({ name: 'leadId', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: LeadResponseDto })
  update(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.updateLeadUseCase.execute(leadId, dto);
  }

  @Patch(':leadId/status')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Advance lead through the pipeline' })
  @ApiParam({ name: 'leadId', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: LeadResponseDto })
  advanceStatus(
    @GetUser() user: User,
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: AdvanceLeadStatusDto,
  ) {
    return this.advanceLeadStatusUseCase.execute(leadId, dto.status, user.id);
  }

  @Patch(':leadId/assign/:executiveId')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign or reassign a lead to an executive' })
  @ApiParam({ name: 'leadId', type: String })
  @ApiParam({ name: 'executiveId', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: LeadResponseDto })
  assign(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Param('executiveId', ParseUUIDPipe) executiveId: string,
  ) {
    return this.assignLeadUseCase.execute(leadId, executiveId);
  }

  @Get(':leadId/history')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead status change history' })
  @ApiParam({ name: 'leadId', type: String })
  @ApiResponse({ status: HttpStatus.OK })
  getHistory(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.getLeadHistoryUseCase.execute(leadId);
  }
}
