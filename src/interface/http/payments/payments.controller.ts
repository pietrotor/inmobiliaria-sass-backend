import {
  Controller,
  Get,
  Post,
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

import { CreatePaymentPlanUseCase } from '@application/payment/use-cases/create-payment-plan.use-case';
import { AddInstallmentUseCase } from '@application/payment/use-cases/add-installment.use-case';
import { RecordPaymentUseCase } from '@application/payment/use-cases/record-payment.use-case';
import { GetDebtStatusUseCase } from '@application/payment/use-cases/get-debt-status.use-case';
import { CreatePaymentPlanDto } from '@application/payment/dto/create-payment-plan.dto';
import { AddInstallmentDto } from '@application/payment/dto/add-installment.dto';
import { RecordPaymentDto } from '@application/payment/dto/record-payment.dto';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentPlanUseCase: CreatePaymentPlanUseCase,
    private readonly addInstallmentUseCase: AddInstallmentUseCase,
    private readonly recordPaymentUseCase: RecordPaymentUseCase,
    private readonly getDebtStatusUseCase: GetDebtStatusUseCase,
  ) {}

  @Post('plans')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment plan for a reservation' })
  @ApiResponse({ status: HttpStatus.CREATED })
  createPlan(@GetUser() user: User, @Body() dto: CreatePaymentPlanDto) {
    return this.createPaymentPlanUseCase.execute(dto.reservationId, user.id);
  }

  @Post('plans/:planId/installments')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an installment to a payment plan' })
  @ApiParam({ name: 'planId', type: String })
  addInstallment(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() dto: AddInstallmentDto,
  ) {
    return this.addInstallmentUseCase.execute(planId, dto);
  }

  @Post('installments/:installmentId/payments')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record a payment for an installment' })
  @ApiParam({ name: 'installmentId', type: String })
  recordPayment(
    @GetUser() user: User,
    @Param('installmentId', ParseUUIDPipe) installmentId: string,
    @Body() dto: RecordPaymentDto,
  ) {
    return this.recordPaymentUseCase.execute(installmentId, user.id, dto);
  }

  @Get('plans/:planId/status')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get debt status for a payment plan' })
  @ApiParam({ name: 'planId', type: String })
  getDebtStatus(@Param('planId', ParseUUIDPipe) planId: string) {
    return this.getDebtStatusUseCase.execute(planId);
  }
}
