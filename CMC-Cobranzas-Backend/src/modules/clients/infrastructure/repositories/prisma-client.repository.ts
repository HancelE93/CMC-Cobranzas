import { Injectable } from '@nestjs/common';
import { ClientStatus as PrismaClientStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import {
  ClientRepositoryPort,
  FindClientsParams,
} from '../../domain/interfaces/client-repository.port';
import { ClientEntity } from '../../domain/types/client.type';

@Injectable()
export class PrismaClientRepository implements ClientRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<ClientEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientEntity> {
    const created = await this.prisma.client.create({
      data: {
        ...data,
        estado: data.estado as PrismaClientStatus,
      },
    });
    return created as ClientEntity;
  }

  async findById(id: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { debts: true },
    });
    return client ? (client as unknown as ClientEntity) : null;
  }

  async findByCedula(cedula: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({
      where: { cedula },
    });
    return client ? (client as ClientEntity) : null;
  }

  async findAll(params?: FindClientsParams): Promise<{ items: ClientEntity[]; total: number }> {
    const where: Prisma.ClientWhereInput = {};

    if (params?.estado) {
      where.estado = params.estado as PrismaClientStatus;
    }

    if (params?.search) {
      where.OR = [
        { cedula: { contains: params.search, mode: 'insensitive' } },
        { nombres: { contains: params.search, mode: 'insensitive' } },
        { apellidos: { contains: params.search, mode: 'insensitive' } },
        { correo: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip: params?.skip ?? 0,
        take: params?.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return { items: items as ClientEntity[], total };
  }

  async update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity> {
    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        ...data,
        estado: data.estado ? (data.estado as PrismaClientStatus) : undefined,
      },
    });
    return updated as ClientEntity;
  }
}

