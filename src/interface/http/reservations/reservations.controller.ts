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

import { CreateReservationUseCase } from '@application/reservation/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '@application/reservation/use-cases/get-reservations.use-case';
import { UpdateReservationStatusUseCase } from '@application/reservation/use-cases/update-reservation-status.use-case';
import { CreateReservationDto } from '@application/reservation/dto/create-reservation.dto';
import { PaginationDto } from '@application/common/dto/pagination.dto';
import { ReservationStatus } from '@domain/reservation/value-objects/reservation-status.vo';

import { Auth, GetUser } from '@interface/http/common';
import { UserRole } from '@domain/user/value-objects/role.vo';
import { User } from '@domain/user/entities/user.entity';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {}

  @Post()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a reservation' })
  @ApiResponse({ status: HttpStatus.CREATED })
  create(@GetUser() user: User, @Body() dto: CreateReservationDto) {
    return this.createReservationUseCase.execute(user.organizationId, dto);
  }

  @Get()
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reservations for developer' })
  getAll(@GetUser() user: User, @Query() pagination: PaginationDto) {
    return this.getReservationsUseCase.execute(
      user.organizationId,
      pagination.limit,
      pagination.offset,
    );
  }

  @Patch(':reservationId/status/:status')
  @Auth(UserRole.DEVELOPER_ADMIN, UserRole.DEVELOPER_SALES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update reservation status' })
  @ApiParam({ name: 'reservationId', type: String })
  @ApiParam({ name: 'status', enum: ReservationStatus })
  updateStatus(
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('status') status: ReservationStatus,
    @Body() body: any,
  ) {
    return this.updateReservationStatusUseCase.execute(
      reservationId,
      status,
      body,
    );
  }
}
