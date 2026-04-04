import { BrokerProjectAccess } from '../entities/broker-project-access.entity';

export const BROKER_PROJECT_ACCESS_REPOSITORY = 'BROKER_PROJECT_ACCESS_REPOSITORY';

export interface CreateBrokerProjectAccessData {
  brokerId: string;
  projectId: string;
  status: string;
}

export interface BrokerProjectAccessRepository {
  create(data: CreateBrokerProjectAccessData): Promise<BrokerProjectAccess>;
  findById(id: string): Promise<BrokerProjectAccess | null>;
  findByBrokerAndProject(brokerId: string, projectId: string): Promise<BrokerProjectAccess | null>;
  findByProject(projectId: string): Promise<BrokerProjectAccess[]>;
  findByBroker(brokerId: string): Promise<BrokerProjectAccess[]>;
  update(id: string, data: Partial<BrokerProjectAccess>): Promise<BrokerProjectAccess>;
  delete(id: string): Promise<void>;
}
