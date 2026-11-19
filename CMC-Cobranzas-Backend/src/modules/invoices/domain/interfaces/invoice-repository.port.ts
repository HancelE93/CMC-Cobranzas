import {
  CreateInvoiceData,
  InvoiceEntity,
  InvoiceFilter,
} from '../types/invoice.entity';

export const INVOICE_REPOSITORY = Symbol('INVOICE_REPOSITORY');

export interface InvoiceRepositoryPort {
  create(data: CreateInvoiceData): Promise<InvoiceEntity>;
  findAll(filter?: InvoiceFilter): Promise<InvoiceEntity[]>;
  findById(id: string): Promise<InvoiceEntity | null>;
  findByNumero(numeroFactura: string): Promise<InvoiceEntity | null>;
  updateEstado(id: string, estadoDocumental: string): Promise<InvoiceEntity>;
}

