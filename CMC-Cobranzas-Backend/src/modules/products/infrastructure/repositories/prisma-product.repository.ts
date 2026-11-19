import { Injectable } from '@nestjs/common';
import { Prisma, ProductStatus as PrismaProductStatus } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import {
  FindProductsParams,
  ProductRepositoryPort,
} from '../../domain/interfaces/product-repository.port';
import { ProductEntity } from '../../domain/types/product.type';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(record: any): ProductEntity {
    return {
      ...record,
      precioNominal: Number(record.precioNominal),
    };
  }

  async create(data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity> {
    const created = await this.prisma.product.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioNominal: data.precioNominal,
        estado: data.estado as PrismaProductStatus,
      },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? this.mapToEntity(product) : null;
  }

  async findAll(params?: FindProductsParams): Promise<{ items: ProductEntity[]; total: number }> {
    const where: Prisma.ProductWhereInput = {};

    if (params?.estado) {
      where.estado = params.estado as PrismaProductStatus;
    }

    if (params?.search) {
      where.OR = [
        { nombre: { contains: params.search, mode: 'insensitive' } },
        { descripcion: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: params?.skip ?? 0,
        take: params?.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapToEntity(item)),
      total,
    };
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity> {
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        estado: data.estado ? (data.estado as PrismaProductStatus) : undefined,
      },
    });
    return this.mapToEntity(updated);
  }
}

