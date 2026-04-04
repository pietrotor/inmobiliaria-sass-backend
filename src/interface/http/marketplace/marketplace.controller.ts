import {
  Controller,
  Get,
  Post,
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

import { GenerateProposalUseCase } from '@application/proposal/use-cases/generate-proposal.use-case';
import { DeclareIntentUseCase } from '@application/intent/use-cases/declare-intent.use-case';
import { ApproveIntentUseCase } from '@application/intent/use-cases/approve-intent.use-case';
import { RejectIntentUseCase } from '@application/intent/use-cases/reject-intent.use-case';
import { CancelIntentUseCase } from '@application/intent/use-cases/cancel-intent.use-case';
import { GetIntentsByProjectUseCase } from '@application/intent/use-cases/get-intents-by-project.use-case';
import { JoinWaitlistUseCase } from '@application/intent/use-cases/join-waitlist.use-case';

import { CreateProposalDto } from '@application/proposal/dto/create-proposal.dto';
import { DeclareIntentDto } from '@application/intent/dto/declare-intent.dto';
import { RejectIntentDto } from '@application/intent/dto/reject-intent.dto';
import { PaginationDto } from '@application/common/dto/pagination.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(
    private readonly generateProposalUseCase: GenerateProposalUseCase,
    private readonly declareIntentUseCase: DeclareIntentUseCase,
    private readonly approveIntentUseCase: ApproveIntentUseCase,
    private readonly rejectIntentUseCase: RejectIntentUseCase,
    private readonly cancelIntentUseCase: CancelIntentUseCase,
    private readonly getIntentsByProjectUseCase: GetIntentsByProjectUseCase,
    private readonly joinWaitlistUseCase: JoinWaitlistUseCase,
  ) {}

  @Post('proposals')
  @Auth(UserRole.BROKER, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a commercial proposal' })
  @ApiResponse({ status: HttpStatus.CREATED })
  generateProposal(@GetUser() user: User, @Body() dto: CreateProposalDto) {
    const isBroker = user.role === UserRole.BROKER;
    return this.generateProposalUseCase.execute(user.id, isBroker, dto);
  }

  @Post('intents')
  @Auth(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Declare a reservation intent (PRO only)' })
  @ApiResponse({ status: HttpStatus.CREATED })
  declareIntent(@GetUser() user: User, @Body() dto: DeclareIntentDto) {
    return this.declareIntentUseCase.execute(user.id, dto);
  }

  @Get('intents/project/:projectId')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get intents for a project' })
  @ApiParam({ name: 'projectId', type: String })
  getIntentsByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.getIntentsByProjectUseCase.execute(
      projectId,
      pagination.limit,
      pagination.offset,
    );
  }

  @Patch('intents/:intentId/approve')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a reservation intent' })
  @ApiParam({ name: 'intentId', type: String })
  approveIntent(@Param('intentId', ParseUUIDPipe) intentId: string) {
    return this.approveIntentUseCase.execute(intentId);
  }

  @Patch('intents/:intentId/reject')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a reservation intent' })
  @ApiParam({ name: 'intentId', type: String })
  rejectIntent(
    @Param('intentId', ParseUUIDPipe) intentId: string,
    @Body() dto: RejectIntentDto,
  ) {
    return this.rejectIntentUseCase.execute(intentId, dto);
  }

  @Patch('intents/:intentId/cancel')
  @Auth(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel own reservation intent' })
  @ApiParam({ name: 'intentId', type: String })
  cancelIntent(
    @GetUser() user: User,
    @Param('intentId', ParseUUIDPipe) intentId: string,
  ) {
    return this.cancelIntentUseCase.execute(intentId, user.id);
  }

  @Post('waitlist/:unitId')
  @Auth(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join waitlist for a unit (PRO only)' })
  @ApiParam({ name: 'unitId', type: String })
  joinWaitlist(
    @GetUser() user: User,
    @Param('unitId', ParseUUIDPipe) unitId: string,
  ) {
    return this.joinWaitlistUseCase.execute(user.id, unitId);
  }
}
