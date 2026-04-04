import {
  Inject,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  POST_SALE_REQUEST_REPOSITORY,
  PostSaleRequestRepository,
} from '@domain/post-sale/repositories/post-sale-request.repository';
import {
  POST_SALE_STATUS_HISTORY_REPOSITORY,
  PostSaleStatusHistoryRepository,
} from '@domain/post-sale/repositories/post-sale-status-history.repository';
import { PostSaleRequestStatus } from '@domain/post-sale/value-objects/request-status.vo';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class UpdatePostSaleStatusUseCase {
  constructor(
    @Inject(POST_SALE_REQUEST_REPOSITORY)
    private readonly repo: PostSaleRequestRepository,
    @Inject(POST_SALE_STATUS_HISTORY_REPOSITORY)
    private readonly historyRepo: PostSaleStatusHistoryRepository,
  ) {}

  async execute(
    requestId: string,
    status: PostSaleRequestStatus,
    userId: string,
  ) {
    try {
      const request = await this.repo.findById(requestId);
      if (!request)
        throw new NotFoundException('Post-sale request not found');
      if (!request.canTransitionTo(status)) {
        throw new BadRequestException(
          `Cannot transition from ${request.status} to ${status}`,
        );
      }

      await this.historyRepo.create({
        requestId,
        fromStatus: request.status,
        toStatus: status,
        changedByUserId: userId,
      });

      const updates: Record<string, any> = { status };
      if (status === PostSaleRequestStatus.CLOSED) {
        updates.closingDate = new Date();
      }

      return await this.repo.update(requestId, updates);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'UpdatePostSaleStatusUseCase');
    }
  }
}
