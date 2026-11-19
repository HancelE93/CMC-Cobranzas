export interface WeeklyCashFlow {
  week: number;
  label: string;
  range: string;
  proyectado: number;
  ejecutado: number;
}

export interface OverdueCommitment {
  debtId: string;
  clientId: string;
  clientName: string;
  clientCedula: string;
  clientPhone: string;
  clientEmail: string;
  productName: string;
  promisedDate: string;
  daysLate: number;
  expectedAmount: number;
  pendingBalance: number;
  debtStatus: string;
  weekIndex: number;
}

export interface CashFlowReport {
  year: number;
  month: number;
  periodKey: string;
  weeks: WeeklyCashFlow[];
  totalProyectado: number;
  totalEjecutado: number;
  totalGap: number;
  efficiency: number;
  overdueCommitments: OverdueCommitment[];
}

