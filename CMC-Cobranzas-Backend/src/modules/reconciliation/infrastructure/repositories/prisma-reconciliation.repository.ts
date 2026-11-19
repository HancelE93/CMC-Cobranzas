import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { ReconciliationRepositoryPort } from '../../domain/interfaces/reconciliation-repository.port';
import {
  CreateReconciliationData,
  ReconciliationEntity,
} from '../../domain/types/reconciliation.entity';

@Injectable()
export class PrismaReconciliationRepository
  implements ReconciliationRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReconciliationData): Promise<ReconciliationEntity> {
    const item = await this.prisma.reconciliation.create({
      data: {
        pagoId: data.pagoId,
        movimientoBancarioId: data.movimientoBancarioId,
        tipo: data.tipo || 'automatica',
        estado: data.estado || 'conciliado',
        reglaCoincidencia: data.reglaCoincidencia,
        observacion: data.observacion,
        conciliadoPor: data.conciliadoPor,
      },
    });
    return this.mapToEntity(item);
  }

  async findAll(): Promise<ReconciliationEntity[]> {
    const items = await this.prisma.reconciliation.findMany({
      orderBy: { fechaConciliacion: 'desc' },
      include: { pago: true, movimiento: true },
    });
    return items.map((i) => this.mapToEntity(i));
  }

  async findById(id: string): Promise<ReconciliationEntity | null> {
    const item = await this.prisma.reconciliation.findUnique({ where: { id } });
    return item ? this.mapToEntity(item) : null;
  }

  async findByPaymentId(pagoId: string): Promise<ReconciliationEntity | null> {
    const item = await this.prisma.reconciliation.findFirst({
      where: { pagoId },
    });
    return item ? this.mapToEntity(item) : null;
  }

  async findByMovementId(
    movimientoBancarioId: string,
  ): Promise<ReconciliationEntity | null> {
    const item = await this.prisma.reconciliation.findFirst({
      where: { movimientoBancarioId },
    });
    return item ? this.mapToEntity(item) : null;
  }

  private mapToEntity(row: Prisma.ReconciliationGetPayload<object>): ReconciliationEntity {
    return {
      id: row.id,
      pagoId: row.pagoId,
      movimientoBancarioId: row.movimientoBancarioId,
      tipo: row.tipo,
      estado: row.estado,
      reglaCoincidencia: row.reglaCoincidencia,
      observacion: row.observacion,
      fechaConciliacion: row.fechaConciliacion,
      conciliadoPor: row.conciliadoPor,
      createdAt: row.createdAt,
    };
  }
}
