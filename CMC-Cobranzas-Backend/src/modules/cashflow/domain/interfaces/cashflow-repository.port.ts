import { CashFlowReport } from '../types/cashflow.type';

export const CASHFLOW_REPOSITORY = Symbol('CASHFLOW_REPOSITORY');

export interface CashFlowRepositoryPort {
  generateReport(year: number, month: number): Promise<CashFlowReport>;
}

