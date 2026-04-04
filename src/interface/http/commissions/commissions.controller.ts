import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { GetCommissionsUseCase } from '@application/commission/use-cases/get-commissions.use-case';
import { MarkCommissionPaidUseCase } from '@application/commission/use-cases/mark-commission-paid.use-case';
import { DisputeCommissionUseCase } from '@application/commission/use-cases/dispute-commission.use-case';
import { PaginationDto } from '@application/common/dto/pagination.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Commissions')
@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly getCommissionsUseCase: GetCommissionsUseCase,
    private readonly markCommissionPaidUseCase: MarkCommissionPaidUseCase,
    private readonly disputeCommissionUseCase: DisputeCommissionUseCase,
  ) {}

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get commissions (broker sees own, developer sees all)',
  })
  getAll(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.getCommissionsUseCase.execute(
      user.id,
      user.role,
      user.organizationId,
      pagination.limit,
      pagination.offset,
    );
  }

  @Patch(':commissionId/paid')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark commission as paid' })
  @ApiParam({ name: 'commissionId', type: String })
  markPaid(
    @GetUser() user: User,
    @Param('commissionId', ParseUUIDPipe) commissionId: string,
  ) {
    return this.markCommissionPaidUseCase.execute(commissionId, user.id);
  }

  @Patch(':commissionId/dispute')
  @Auth(UserRole.DEVELOPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark commission as in dispute' })
  @ApiParam({ name: 'commissionId', type: String })
  dispute(
    @Param('commissionId', ParseUUIDPipe) commissionId: string,
    @Body() body: { note: string },
  ) {
    return this.disputeCommissionUseCase.execute(commissionId, body.note);
  }
}
