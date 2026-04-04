import {
  Controller,
  Get,
  Post,
  Patch,
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
} from '@nestjs/swagger';

import { RegisterBrokerUseCase } from '@application/broker/use-cases/register-broker.use-case';
import { ApproveBrokerUseCase } from '@application/broker/use-cases/approve-broker.use-case';
import { SuspendBrokerUseCase } from '@application/broker/use-cases/suspend-broker.use-case';
import { GetPendingBrokersUseCase } from '@application/broker/use-cases/get-pending-brokers.use-case';
import { GetBrokerProfileUseCase } from '@application/broker/use-cases/get-broker-profile.use-case';
import { UpgradeBrokerPlanUseCase } from '@application/broker/use-cases/upgrade-broker-plan.use-case';
import { InviteBrokerToProjectUseCase } from '@application/broker/use-cases/invite-broker-to-project.use-case';
import { RevokeBrokerAccessUseCase } from '@application/broker/use-cases/revoke-broker-access.use-case';

import { RegisterBrokerDto } from '@application/broker/dto/register-broker.dto';
import { BrokerResponseDto } from '@application/broker/dto/broker-response.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Brokers')
@Controller('brokers')
export class BrokersController {
  constructor(
    private readonly registerBrokerUseCase: RegisterBrokerUseCase,
    private readonly approveBrokerUseCase: ApproveBrokerUseCase,
    private readonly suspendBrokerUseCase: SuspendBrokerUseCase,
    private readonly getPendingBrokersUseCase: GetPendingBrokersUseCase,
    private readonly getBrokerProfileUseCase: GetBrokerProfileUseCase,
    private readonly upgradeBrokerPlanUseCase: UpgradeBrokerPlanUseCase,
    private readonly inviteBrokerToProjectUseCase: InviteBrokerToProjectUseCase,
    private readonly revokeBrokerAccessUseCase: RevokeBrokerAccessUseCase,
  ) {}

  @Post('register')
  @Auth(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a broker (self-registration)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BrokerResponseDto })
  register(@GetUser() user: User, @Body() dto: RegisterBrokerDto) {
    return this.registerBrokerUseCase.execute(user.id, dto);
  }

  @Get('me')
  @Auth(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own broker profile with cancellation count' })
  @ApiResponse({ status: HttpStatus.OK, type: BrokerResponseDto })
  getProfile(@GetUser() user: User) {
    return this.getBrokerProfileUseCase.execute(user.id);
  }

  @Patch('me/upgrade')
  @Auth(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade to PRO plan' })
  @ApiResponse({ status: HttpStatus.OK, type: BrokerResponseDto })
  upgrade(@GetUser() user: User) {
    return this.upgradeBrokerPlanUseCase.execute(user.id);
  }

  @Get('pending')
  @Auth(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending broker registrations' })
  @ApiResponse({ status: HttpStatus.OK, type: [BrokerResponseDto] })
  getPending() {
    return this.getPendingBrokersUseCase.execute();
  }

  @Patch(':brokerId/approve')
  @Auth(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a broker registration' })
  @ApiParam({ name: 'brokerId', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: BrokerResponseDto })
  approve(@Param('brokerId', ParseUUIDPipe) brokerId: string) {
    return this.approveBrokerUseCase.execute(brokerId);
  }

  @Patch(':brokerId/suspend')
  @Auth(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend a broker' })
  @ApiParam({ name: 'brokerId', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: BrokerResponseDto })
  suspend(@Param('brokerId', ParseUUIDPipe) brokerId: string) {
    return this.suspendBrokerUseCase.execute(brokerId);
  }

  @Post(':brokerId/projects/:projectId/invite')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a broker to a private project' })
  @ApiParam({ name: 'brokerId', type: String })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({ status: HttpStatus.CREATED })
  inviteToProject(
    @Param('brokerId', ParseUUIDPipe) brokerId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.inviteBrokerToProjectUseCase.execute(brokerId, projectId);
  }

  @Delete(':brokerId/projects/:projectId/access')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke broker access to a project' })
  @ApiParam({ name: 'brokerId', type: String })
  @ApiParam({ name: 'projectId', type: String })
  @ApiResponse({ status: HttpStatus.OK })
  revokeAccess(
    @Param('brokerId', ParseUUIDPipe) brokerId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.revokeBrokerAccessUseCase.execute(brokerId, projectId);
  }
}
