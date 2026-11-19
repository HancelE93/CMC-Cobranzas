import { ClientEntity, ClientStatus } from '../types/client.type';

export interface FindClientsParams {
  search?: string;
  estado?: ClientStatus;
  skip?: number;
  take?: number;
}

export interface ClientRepositoryPort {
  create(data: Omit<ClientEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientEntity>;
  findById(id: string): Promise<ClientEntity | null>;
  findByCedula(cedula: string): Promise<ClientEntity | null>;
  findAll(params?: FindClientsParams): Promise<{ items: ClientEntity[]; total: number }>;
  update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity>;
}

export const CLIENT_REPOSITORY_PORT = Symbol('ClientRepositoryPort');

