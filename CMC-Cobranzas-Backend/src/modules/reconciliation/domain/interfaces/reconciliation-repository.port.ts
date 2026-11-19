import {
  CreateReconciliationData,
  ReconciliationEntity,
} from '../types/reconciliation.entity';

export const RECONCILIATION_REPOSITORY = Symbol('RECONCILIATION_REPOSITORY');

export interface ReconciliationRepositoryPort {
  create(data: CreateReconciliationData): Promise<ReconciliationEntity>;
  findAll(): Promise<ReconciliationEntity[]>;
  findById(id: string): Promise<ReconciliationEntity | null>;
  findByPaymentId(pagoId: string): Promise<ReconciliationEntity | null>;
  findByMovementId(movimientoId: string): Promise<ReconciliationEntity | null>;
}

