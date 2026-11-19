export interface InvoiceEntity {
  id: string;
  clienteId: string;
  deudaId: string | null;
  numeroFactura: string;
  fechaFactura: Date;
  monto: number;
  estadoDocumental: string;
  observaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceData {
  clienteId: string;
  deudaId?: string;
  numeroFactura: string;
  fechaFactura: Date;
  monto: number;
  estadoDocumental?: string;
  observaciones?: string;
}

export interface InvoiceFilter {
  clienteId?: string;
  deudaId?: string;
  estadoDocumental?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

