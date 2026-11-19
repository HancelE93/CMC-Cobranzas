import {
  BankMovementEntity,
  BankMovementFilter,
  CreateBankMovementData,
} from '../types/bank-movement.entity';

export const BANK_MOVEMENT_REPOSITORY = Symbol('BANK_MOVEMENT_REPOSITORY');

export interface BankMovementRepositoryPort {
  createMany(
    movements: CreateBankMovementData[],
  ): Promise<{ inserted: number; duplicates: number }>;
  findAll(filter?: BankMovementFilter): Promise<BankMovementEntity[]>;
  findById(id: string): Promise<BankMovementEntity | null>;
  findByTransaction(
    banco: string,
    numeroTransaccion: string,
  ): Promise<BankMovementEntity | null>;
  updateStatus(id: string, estado: string): Promise<void>;
  findPendingMovements(banco?: string): Promise<BankMovementEntity[]>;
}

