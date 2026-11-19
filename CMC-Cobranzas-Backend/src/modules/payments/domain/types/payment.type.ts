export type PaymentMethod = 'TRANSFERENCIA' | 'EFECTIVO' | 'TARJETA' | 'DEPOSITO' | 'OTRO';
export type PaymentRegisterStatus = 'REGISTRADO' | 'PENDIENTE_REVISION' | 'ANULADO';
export type ReconciliationStatus =
  | 'PENDIENTE'
  | 'CONCILIADO_AUTO'
  | 'REVISION_MANUAL'
  | 'CONCILIADO_MANUAL'
  | 'NO_ENCONTRADO'
  | 'CON_DIFERENCIAS';

export interface PaymentEntity {
  id: string;
  deudaId: string;
  clienteId: string;
  monto: number;
  fechaPago: Date;
  metodo: PaymentMethod;
  bancoOrigen?: string | null;
  numeroTransaccion?: string | null;
  referencia?: string | null;
  comprobanteUrl?: string | null;
  estadoRegistro: PaymentRegisterStatus;
  estadoConciliacion: ReconciliationStatus;
  observaciones?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

