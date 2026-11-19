import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { InvoiceRepositoryPort } from '../../domain/interfaces/invoice-repository.port';
import {
  CreateInvoiceData,
  InvoiceEntity,
  InvoiceFilter,
} from '../../domain/types/invoice.entity';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateInvoiceData): Promise<InvoiceEntity> {
    const item = await this.prisma.invoice.create({
      data: {
        clienteId: data.clienteId,
        deudaId: data.deudaId,
        numeroFactura: data.numeroFactura,
        fechaFactura: data.fechaFactura,
        monto: new Prisma.Decimal(data.monto),
        estadoDocumental: data.estadoDocumental || 'pendiente_registrar',
        observaciones: data.observaciones,
      },
    });
    return this.mapToEntity(item);
  }

  async findAll(filter?: InvoiceFilter): Promise<InvoiceEntity[]> {
    const where: Prisma.InvoiceWhereInput = {
      ...(filter?.clienteId && { clienteId: filter.clienteId }),
      ...(filter?.deudaId && { deudaId: filter.deudaId }),
      ...(filter?.estadoDocumental && {
        estadoDocumental: filter.estadoDocumental,
      }),
      ...((filter?.fechaDesde || filter?.fechaHasta) && {
        fechaFactura: {
          ...(filter.fechaDesde && { gte: filter.fechaDesde }),
          ...(filter.fechaHasta && { lte: filter.fechaHasta }),
        },
      }),
    };
    const items = await this.prisma.invoice.findMany({
      where,
      orderBy: { fechaFactura: 'desc' },
    });
    return items.map((i) => this.mapToEntity(i));
  }

  async findById(id: string): Promise<InvoiceEntity | null> {
    const item = await this.prisma.invoice.findUnique({ where: { id } });
    return item ? this.mapToEntity(item) : null;
  }

  async findByNumero(numeroFactura: string): Promise<InvoiceEntity | null> {
    const item = await this.prisma.invoice.findUnique({
      where: { numeroFactura },
    });
    return item ? this.mapToEntity(item) : null;
  }

  async updateEstado(
    id: string,
    estadoDocumental: string,
  ): Promise<InvoiceEntity> {
    const item = await this.prisma.invoice.update({
      where: { id },
      data: { estadoDocumental },
    });
    return this.mapToEntity(item);
  }

  private mapToEntity(
    row: Prisma.InvoiceGetPayload<object>,
  ): InvoiceEntity {
    return {
      id: row.id,
      clienteId: row.clienteId,
      deudaId: row.deudaId,
      numeroFactura: row.numeroFactura,
      fechaFactura: row.fechaFactura,
      monto: Number(row.monto),
      estadoDocumental: row.estadoDocumental,
      observaciones: row.observaciones,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

