import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  POST_SALE_REQUEST_REPOSITORY,
  PostSaleRequestRepository,
} from '@domain/post-sale/repositories/post-sale-request.repository';
import { PostSaleRequestStatus } from '@domain/post-sale/value-objects/request-status.vo';
import { CreatePostSaleRequestDto } from '../dto/create-post-sale-request.dto';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class CreatePostSaleRequestUseCase {
  constructor(
    @Inject(POST_SALE_REQUEST_REPOSITORY)
    private readonly repo: PostSaleRequestRepository,
  ) {}

  async execute(dto: CreatePostSaleRequestDto) {
    try {
      return await this.repo.create({
        unitId: dto.unitId,
        reservationId: dto.reservationId,
        requestType: dto.requestType,
        description: dto.description,
        assignedToUserId: dto.assignedToUserId,
        status: PostSaleRequestStatus.OPEN,
        resolutionDeadline: dto.resolutionDeadline
          ? new Date(dto.resolutionDeadline)
          : undefined,
        registrationDate: new Date(),
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'CreatePostSaleRequestUseCase');
    }
  }
}
