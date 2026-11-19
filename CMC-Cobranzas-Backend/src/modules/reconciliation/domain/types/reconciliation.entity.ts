export interface ReconciliationEntity {
  id: string;
  pagoId: string;
  movimientoBancarioId: string;
  tipo: string;
  estado: string;
  reglaCoincidencia: string | null;
  observacion: string | null;
  fechaConciliacion: Date;
  conciliadoPor: string | null;
  createdAt: Date;
}

export interface CreateReconciliationData {
  pagoId: string;
  movimientoBancarioId: string;
  tipo?: string;
  estado?: string;
  reglaCoincidencia?: string;
  observacion?: string;
  conciliadoPor?: string;
}

