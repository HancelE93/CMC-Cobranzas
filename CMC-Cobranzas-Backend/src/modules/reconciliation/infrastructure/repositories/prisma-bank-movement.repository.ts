import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { BankMovementRepositoryPort } from '../../domain/interfaces/bank-movement-repository.port';
import {
  BankMovementEntity,
  BankMovementFilter,
  CreateBankMovementData,
} from '../../domain/types/bank-movement.entity';

@Injectable()
export class PrismaBankMovementRepository
  implements BankMovementRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    movements: CreateBankMovementData[],
  ): Promise<{ inserted: number; duplicates: number }> {
    let inserted = 0;
    let duplicates = 0;

    for (const mov of movements) {
      const exists = await this.findByTransaction(
        mov.banco,
        mov.numeroTransaccion,
      );
      if (exists) {
        duplicates++;
        continue;
      }
      await this.prisma.bankMovement.create({
        data: {
          fecha: mov.fecha,
          monto: new Prisma.Decimal(mov.monto),
          numeroTransaccion: mov.numeroTransaccion,
          referencia: mov.referencia,
          ordenante: mov.ordenante,
          banco: mov.banco,
          estado: mov.estado || 'sin_asignar',
        },
      });
      inserted++;
    }
    return { inserted, duplicates };
  }

  async findAll(filter?: BankMovementFilter): Promise<BankMovementEntity[]> {
    const where: Prisma.BankMovementWhereInput = {
      ...(filter?.banco && { banco: filter.banco }),
      ...(filter?.estado && { estado: filter.estado }),
      ...((filter?.fechaDesde || filter?.fechaHasta) && {
        fecha: {
          ...(filter.fechaDesde && { gte: filter.fechaDesde }),
          ...(filter.fechaHasta && { lte: filter.fechaHasta }),
        },
      }),
    };
    const items = await this.prisma.bankMovement.findMany({
      where,
      orderBy: { fecha: 'desc' },
    });
    return items.map((i) => this.mapToEntity(i));
  }

  async findById(id: string): Promise<BankMovementEntity | null> {
    const item = await this.prisma.bankMovement.findUnique({ where: { id } });
    return item ? this.mapToEntity(item) : null;
  }

  async findByTransaction(
    banco: string,
    numeroTransaccion: string,
  ): Promise<BankMovementEntity | null> {
    const item = await this.prisma.bankMovement.findFirst({
      where: { banco, numeroTransaccion },
    });
    return item ? this.mapToEntity(item) : null;
  }

  async updateStatus(id: string, estado: string): Promise<void> {
    await this.prisma.bankMovement.update({
      where: { id },
      data: { estado },
    });
  }

  async findPendingMovements(banco?: string): Promise<BankMovementEntity[]> {
    return this.findAll({ banco, estado: 'sin_asignar' });
  }

  private mapToEntity(row: Prisma.BankMovementGetPayload<object>): BankMovementEntity {
    return {
      id: row.id,
      fecha: row.fecha,
      monto: Number(row.monto),
      numeroTransaccion: row.numeroTransaccion,
      referencia: row.referencia,
      ordenante: row.ordenante,
      banco: row.banco,
      estado: row.estado,
      createdAt: row.createdAt,
    };
  }
}
