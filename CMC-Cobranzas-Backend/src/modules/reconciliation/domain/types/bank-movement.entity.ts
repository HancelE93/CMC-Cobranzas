export interface BankMovementEntity {
  id: string;
  fecha: Date;
  monto: number;
  numeroTransaccion: string;
  referencia: string | null;
  ordenante: string | null;
  banco: string;
  estado: string;
  createdAt: Date;
}

export interface CreateBankMovementData {
  fecha: Date;
  monto: number;
  numeroTransaccion: string;
  referencia?: string;
  ordenante?: string;
  banco: string;
  estado?: string;
}

export interface BankMovementFilter {
  banco?: string;
  estado?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

