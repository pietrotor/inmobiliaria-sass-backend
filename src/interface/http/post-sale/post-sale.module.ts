import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PostSaleController } from './post-sale.controller';

import { CreatePostSaleRequestUseCase } from '@application/post-sale/use-cases/create-post-sale-request.use-case';
import { UpdatePostSaleStatusUseCase } from '@application/post-sale/use-cases/update-post-sale-status.use-case';
import { GetPostSaleRequestsUseCase } from '@application/post-sale/use-cases/get-post-sale-requests.use-case';

import { DrizzleModule } from '@infrastructure/persistence/drizzle/drizzle.module';
import { DrizzlePostSaleRequestRepository } from '@infrastructure/persistence/repositories/post-sale-request.repository.impl';
import { DrizzlePostSaleStatusHistoryRepository } from '@infrastructure/persistence/repositories/post-sale-status-history.repository.impl';
import { POST_SALE_REQUEST_REPOSITORY } from '@domain/post-sale/repositories/post-sale-request.repository';
import { POST_SALE_STATUS_HISTORY_REPOSITORY } from '@domain/post-sale/repositories/post-sale-status-history.repository';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DrizzleModule,
    UsersModule,
  ],
  controllers: [PostSaleController],
  providers: [
    CreatePostSaleRequestUseCase,
    UpdatePostSaleStatusUseCase,
    GetPostSaleRequestsUseCase,
    {
      provide: POST_SALE_REQUEST_REPOSITORY,
      useClass: DrizzlePostSaleRequestRepository,
    },
    {
      provide: POST_SALE_STATUS_HISTORY_REPOSITORY,
      useClass: DrizzlePostSaleStatusHistoryRepository,
    },
  ],
  exports: [POST_SALE_REQUEST_REPOSITORY],
})
export class PostSaleModule {}
