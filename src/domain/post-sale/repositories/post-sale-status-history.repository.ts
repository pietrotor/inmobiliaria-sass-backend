import { PostSaleStatusHistory } from '../entities/post-sale-status-history.entity';

export const POST_SALE_STATUS_HISTORY_REPOSITORY = 'POST_SALE_STATUS_HISTORY_REPOSITORY';

export interface CreatePostSaleStatusHistoryData {
  requestId: string;
  fromStatus: string;
  toStatus: string;
  changedByUserId: string;
}

export interface PostSaleStatusHistoryRepository {
  create(data: CreatePostSaleStatusHistoryData): Promise<PostSaleStatusHistory>;
  findByRequestId(requestId: string): Promise<PostSaleStatusHistory[]>;
}
