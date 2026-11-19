import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import {
  CreatePaymentData,
  FindPaymentsParams,
  PaymentRepositoryPort,
} from '../../domain/interfaces/payment-repository.port';
import { PaymentEntity } from '../../domain/types/payment.type';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createWithDebtAmortization(
    data: CreatePaymentData,
    nuevoSaldo: number,
    nuevoEstadoDeuda: 'PENDIENTE' | 'PARCIAL' | 'PAGADA',
  ): Promise<PaymentEntity> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const payment = await tx.payment.create({
        data: {
          deudaId: data.deudaId,
          clienteId: data.clienteId,
          monto: new Prisma.Decimal(data.monto),
          fechaPago: data.fechaPago,
          metodo: data.metodo,
          bancoOrigen: data.bancoOrigen,
          numeroTransaccion: data.numeroTransaccion,
          referencia: data.referencia,
          comprobanteUrl: data.comprobanteUrl,
          observaciones: data.observaciones,
        },
      });

      await tx.debt.update({
        where: { id: data.deudaId },
        data: {
          saldoActual: new Prisma.Decimal(nuevoSaldo),
          estado: nuevoEstadoDeuda,
        },
      });

      return this.mapToEntity(payment);
    });
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? this.mapToEntity(payment) : null;
  }

  async findAll(params?: FindPaymentsParams): Promise<{ items: PaymentEntity[]; total: number }> {
    const where: Prisma.PaymentWhereInput = {
      ...(params?.clienteId && { clienteId: params.clienteId }),
      ...(params?.deudaId && { deudaId: params.deudaId }),
      ...(params?.metodo && { metodo: params.metodo }),
      ...(params?.estadoRegistro && { estadoRegistro: params.estadoRegistro }),
      ...((params?.fechaDesde || params?.fechaHasta) && {
        fechaPago: {
          ...(params?.fechaDesde && { gte: params.fechaDesde }),
          ...(params?.fechaHasta && { lte: params.fechaHasta }),
        },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip: params?.skip,
        take: params?.take,
        orderBy: { fechaPago: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { items: items.map((p: any) => this.mapToEntity(p)), total };
  }

  private mapToEntity(p: any): PaymentEntity {
    return {
      id: p.id,
      deudaId: p.deudaId,
      clienteId: p.clienteId,
      monto: Number(p.monto),
      fechaPago: p.fechaPago,
      metodo: p.metodo,
      bancoOrigen: p.bancoOrigen,
      numeroTransaccion: p.numeroTransaccion,
      referencia: p.referencia,
      comprobanteUrl: p.comprobanteUrl,
      estadoRegistro: p.estadoRegistro,
      estadoConciliacion: p.estadoConciliacion,
      observaciones: p.observaciones,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
