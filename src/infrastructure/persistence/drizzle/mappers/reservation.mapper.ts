import { Reservation } from '@domain/reservation/entities/reservation.entity';
import { ReservationStatus } from '@domain/reservation/value-objects/reservation-status.vo';
import { SalesChannel } from '@domain/reservation/value-objects/sales-channel.vo';
import { ReservationSchema } from '../schema/reservation.schema';

export class ReservationMapper {
  static toDomain(schema: ReservationSchema): Reservation {
    return new Reservation({
      id: schema.id,
      unitIds: schema.unitIds as string[],
      clientName: schema.clientName,
      clientNationalId: schema.clientNationalId,
      clientPhone: schema.clientPhone,
      clientEmail: schema.clientEmail ?? undefined,
      salesChannel: schema.salesChannel as SalesChannel,
      brokerId: schema.brokerId ?? undefined,
      intentId: schema.intentId ?? undefined,
      executiveId: schema.executiveId ?? undefined,
      developerId: schema.developerId,
      reservationPaymentAmount: schema.reservationPaymentAmount,
      reservationPaymentCurrency: schema.reservationPaymentCurrency,
      reservationPaymentDate: schema.reservationPaymentDate,
      agreementDeadline: schema.agreementDeadline ?? undefined,
      status: schema.status as ReservationStatus,
      agreementSignedDate: schema.agreementSignedDate ?? undefined,
      deliveryDate: schema.deliveryDate ?? undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(
    entity: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Omit<ReservationSchema, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      unitIds: entity.unitIds as any,
      clientName: entity.clientName,
      clientNationalId: entity.clientNationalId,
      clientPhone: entity.clientPhone,
      clientEmail: entity.clientEmail ?? null,
      salesChannel: entity.salesChannel as any,
      brokerId: entity.brokerId ?? null,
      intentId: entity.intentId ?? null,
      executiveId: entity.executiveId ?? null,
      developerId: entity.developerId,
      reservationPaymentAmount: entity.reservationPaymentAmount,
      reservationPaymentCurrency: entity.reservationPaymentCurrency,
      reservationPaymentDate: entity.reservationPaymentDate,
      agreementDeadline: entity.agreementDeadline ?? null,
      status: entity.status as any,
      agreementSignedDate: entity.agreementSignedDate ?? null,
      deliveryDate: entity.deliveryDate ?? null,
    };
  }
}
