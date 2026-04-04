import { PostSaleRequest } from '@domain/post-sale/entities/post-sale-request.entity';
import { PostSaleRequestType } from '@domain/post-sale/value-objects/request-type.vo';
import { PostSaleRequestStatus } from '@domain/post-sale/value-objects/request-status.vo';
import { PostSaleRequestSchema } from '../schema/post-sale-request.schema';

export class PostSaleRequestMapper {
  static toDomain(schema: PostSaleRequestSchema): PostSaleRequest {
    return new PostSaleRequest({
      id: schema.id,
      unitId: schema.unitId,
      reservationId: schema.reservationId,
      requestType: schema.requestType as PostSaleRequestType,
      description: schema.description,
      assignedToUserId: schema.assignedToUserId ?? undefined,
      status: schema.status as PostSaleRequestStatus,
      resolutionDeadline: schema.resolutionDeadline ?? undefined,
      processNotes: schema.processNotes ?? undefined,
      registrationDate: schema.registrationDate,
      closingDate: schema.closingDate ?? undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    entity: Omit<PostSaleRequest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<PostSaleRequestSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      unitId: entity.unitId,
      reservationId: entity.reservationId,
      requestType: entity.requestType as any,
      description: entity.description,
      assignedToUserId: entity.assignedToUserId ?? null,
      status: entity.status as any,
      resolutionDeadline: entity.resolutionDeadline ?? null,
      processNotes: entity.processNotes ?? null,
      registrationDate: entity.registrationDate,
      closingDate: entity.closingDate ?? null,
    };
  }
}
