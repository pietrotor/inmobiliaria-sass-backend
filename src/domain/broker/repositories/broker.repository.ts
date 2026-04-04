import { Broker } from '../entities/broker.entity';

export const BROKER_REPOSITORY = 'BROKER_REPOSITORY';

export interface CreateBrokerData {
  userId: string;
  plan: string;
  status: string;
  companyName?: string;
  licenseNumber?: string;
}

export interface BrokerRepository {
  create(data: CreateBrokerData): Promise<Broker>;
  findById(id: string): Promise<Broker | null>;
  findByUserId(userId: string): Promise<Broker | null>;
  findAll(): Promise<Broker[]>;
  findByStatus(status: string): Promise<Broker[]>;
  update(id: string, data: Partial<Broker>): Promise<Broker>;
  delete(id: string): Promise<void>;
  countCancellationsLast30Days(brokerId: string): Promise<number>;
}
