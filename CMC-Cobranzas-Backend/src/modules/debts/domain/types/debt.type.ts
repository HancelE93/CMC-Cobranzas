export type DebtStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADA' | 'ANULADA';

export interface Installment {
  numero: number;
  monto: number;
  fechaVencimiento: string;
  estado: 'pendiente' | 'pagada' | 'vencida';
}

export interface DebtEntity {
  id: string;
  clienteId: string;
  productoId: string;
  fechaAdquisicion: Date;
  precioNominalAplicado: number;
  precioAcordado: number;
  saldoInicial: number;
  saldoActual: number;
  metodoPago?: string | null;
  plazoMeses?: number | null;
  diaCorte?: number | null;
  cuotas?: Installment[] | null;
  observaciones?: string | null;
  estado: DebtStatus;
  createdAt: Date;
  updatedAt: Date;
}

