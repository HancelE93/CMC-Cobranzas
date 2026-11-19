import { Injectable } from '@nestjs/common';
import { DebtStatus as PrismaDebtStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { DebtRepositoryPort, FindDebtsParams } from '../../domain/interfaces/debt-repository.port';
import { DebtEntity, DebtStatus, Installment } from '../../domain/types/debt.type';

@Injectable()
export class PrismaDebtRepository implements DebtRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(record: any): DebtEntity {
    return {
      ...record,
      precioNominalAplicado: Number(record.precioNominalAplicado),
      precioAcordado: Number(record.precioAcordado),
      saldoInicial: Number(record.saldoInicial),
      saldoActual: Number(record.saldoActual),
      cuotas: record.cuotas as Installment[] | null,
    };
  }

  async create(data: Omit<DebtEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DebtEntity> {
    const created = await this.prisma.debt.create({
      data: {
        clienteId: data.clienteId,
        productoId: data.productoId,
        fechaAdquisicion: data.fechaAdquisicion,
        precioNominalAplicado: data.precioNominalAplicado,
        precioAcordado: data.precioAcordado,
        saldoInicial: data.saldoInicial,
        saldoActual: data.saldoActual,
        metodoPago: data.metodoPago,
        plazoMeses: data.plazoMeses,
        diaCorte: data.diaCorte,
        cuotas: (data.cuotas as any) ?? Prisma.JsonNull,
        observaciones: data.observaciones,
        estado: data.estado as PrismaDebtStatus,
      },
      include: { cliente: true, producto: true },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<DebtEntity | null> {
    const debt = await this.prisma.debt.findUnique({
      where: { id },
      include: { cliente: true, producto: true, payments: true },
    });
    return debt ? this.mapToEntity(debt) : null;
  }

  async findAll(params?: FindDebtsParams): Promise<{ items: DebtEntity[]; total: number }> {
    const where: Prisma.DebtWhereInput = {};
    if (params?.clienteId) where.clienteId = params.clienteId;
    if (params?.productoId) where.productoId = params.productoId;
    if (params?.estado) where.estado = params.estado as PrismaDebtStatus;
    if (params?.search) {
      where.cliente = {
        OR: [
          { cedula: { contains: params.search, mode: 'insensitive' } },
          { nombres: { contains: params.search, mode: 'insensitive' } },
          { apellidos: { contains: params.search, mode: 'insensitive' } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.debt.findMany({
        where,
        include: { cliente: true, producto: true },
        skip: params?.skip ?? 0,
        take: params?.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.debt.count({ where }),
    ]);

    return { items: items.map((i) => this.mapToEntity(i)), total };
  }

  async update(id: string, data: Partial<DebtEntity>): Promise<DebtEntity> {
    const updated = await this.prisma.debt.update({
      where: { id },
      data: {
        ...data,
        estado: data.estado ? (data.estado as PrismaDebtStatus) : undefined,
        cuotas: data.cuotas ? (data.cuotas as any) : undefined,
      },
      include: { cliente: true, producto: true },
    });
    return this.mapToEntity(updated);
  }

  async updateSaldo(id: string, nuevoSaldo: number, nuevoEstado?: DebtStatus): Promise<DebtEntity> {
    const updated = await this.prisma.debt.update({
      where: { id },
      data: {
        saldoActual: nuevoSaldo,
        estado: nuevoEstado ? (nuevoEstado as PrismaDebtStatus) : undefined,
      },
      include: { cliente: true, producto: true },
    });
    return this.mapToEntity(updated);
  }
}

