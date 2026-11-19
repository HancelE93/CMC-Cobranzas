import { DebtEntity, DebtStatus } from '../types/debt.type';

export interface FindDebtsParams {
  clienteId?: string;
  productoId?: string;
  estado?: DebtStatus;
  search?: string;
  skip?: number;
  take?: number;
}

export interface DebtRepositoryPort {
  create(data: Omit<DebtEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DebtEntity>;
  findById(id: string): Promise<DebtEntity | null>;
  findAll(params?: FindDebtsParams): Promise<{ items: DebtEntity[]; total: number }>;
  update(id: string, data: Partial<DebtEntity>): Promise<DebtEntity>;
  updateSaldo(id: string, nuevoSaldo: number, nuevoEstado?: DebtStatus): Promise<DebtEntity>;
}

export const DEBT_REPOSITORY_PORT = Symbol('DebtRepositoryPort');

