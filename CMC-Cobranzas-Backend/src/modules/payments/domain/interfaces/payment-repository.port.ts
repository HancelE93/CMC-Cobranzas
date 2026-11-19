import { PaymentEntity, PaymentMethod, PaymentRegisterStatus } from '../types/payment.type';

export interface FindPaymentsParams {
  clienteId?: string;
  deudaId?: string;
  metodo?: PaymentMethod;
  estadoRegistro?: PaymentRegisterStatus;
  fechaDesde?: Date;
  fechaHasta?: Date;
  skip?: number;
  take?: number;
}

export interface CreatePaymentData {
  deudaId: string;
  clienteId: string;
  monto: number;
  fechaPago: Date;
  metodo: PaymentMethod;
  bancoOrigen?: string | null;
  numeroTransaccion?: string | null;
  referencia?: string | null;
  comprobanteUrl?: string | null;
  observaciones?: string | null;
}

export interface PaymentRepositoryPort {
  createWithDebtAmortization(
    paymentData: CreatePaymentData,
    nuevoSaldo: number,
    nuevoEstadoDeuda: 'PENDIENTE' | 'PARCIAL' | 'PAGADA',
  ): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  findAll(params?: FindPaymentsParams): Promise<{ items: PaymentEntity[]; total: number }>;
}

export const PAYMENT_REPOSITORY_PORT = Symbol('PaymentRepositoryPort');

