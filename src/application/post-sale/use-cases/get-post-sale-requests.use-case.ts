import { Inject, Injectable, HttpException } from '@nestjs/common';
import {
  POST_SALE_REQUEST_REPOSITORY,
  PostSaleRequestRepository,
} from '@domain/post-sale/repositories/post-sale-request.repository';
import { DatabaseErrorHandler } from '@infrastructure/errors/database-error.handler';

@Injectable()
export class GetPostSaleRequestsUseCase {
  constructor(
    @Inject(POST_SALE_REQUEST_REPOSITORY)
    private readonly repo: PostSaleRequestRepository,
  ) {}

  async execute(unitId: string, limit: number, offset: number) {
    try {
      return await this.repo.findByUnitId(unitId, limit, offset);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      DatabaseErrorHandler.handle(error, 'GetPostSaleRequestsUseCase');
    }
  }
}
