import { PostSaleRequest } from '../entities/post-sale-request.entity';
import { PaginatedResult } from '@domain/common/interfaces/paginated-result.interface';

export const POST_SALE_REQUEST_REPOSITORY = 'POST_SALE_REQUEST_REPOSITORY';

export interface CreatePostSaleRequestData {
  unitId: string;
  reservationId: string;
  requestType: string;
  description: string;
  assignedToUserId?: string;
  status: string;
  resolutionDeadline?: Date;
  registrationDate: Date;
}

export interface PostSaleRequestRepository {
  create(data: CreatePostSaleRequestData): Promise<PostSaleRequest>;
  findById(id: string): Promise<PostSaleRequest | null>;
  findByUnitId(unitId: string, limit: number, offset: number): Promise<PaginatedResult<PostSaleRequest>>;
  findByDeveloperId(developerId: string, limit: number, offset: number): Promise<PaginatedResult<PostSaleRequest>>;
  findStale(staleDays: number): Promise<PostSaleRequest[]>;
  update(id: string, data: Partial<PostSaleRequest>): Promise<PostSaleRequest>;
  delete(id: string): Promise<void>;
}
