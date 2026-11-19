import { Injectable } from '@nestjs/common';
import { Prisma, Role as PrismaRole, UserStatus as PrismaUserStatus } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { FindUsersParams, UserAdminRepositoryPort } from '../../domain/interfaces/user-admin-repository.port';
import { UserAdminEntity, UserWithPasswordEntity } from '../../domain/types/user-admin.type';

@Injectable()
export class PrismaUserAdminRepository implements UserAdminRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(record: any): UserAdminEntity {
    const { passwordHash: _, ...entity } = record;
    return entity as UserAdminEntity;
  }

  async create(data: Omit<UserWithPasswordEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserAdminEntity> {
    const created = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        nombre: data.nombre,
        cargo: data.cargo,
        rol: data.rol as PrismaRole,
        estado: data.estado as PrismaUserStatus,
        permisos: data.permisos ?? Prisma.JsonNull,
      },
    });
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<UserAdminEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.mapToEntity(user) : null;
  }

  async findByUsernameOrEmail(identifier: string): Promise<UserAdminEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: identifier }, { email: identifier }] },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async findAll(params?: FindUsersParams): Promise<{ items: UserAdminEntity[]; total: number }> {
    const where: Prisma.UserWhereInput = {};
    if (params?.rol) where.rol = params.rol as PrismaRole;
    if (params?.estado) where.estado = params.estado as PrismaUserStatus;
    if (params?.search) {
      where.OR = [
        { username: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { nombre: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: params?.skip ?? 0,
        take: params?.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items: items.map((u) => this.mapToEntity(u)), total };
  }

  async update(id: string, data: Partial<UserWithPasswordEntity>): Promise<UserAdminEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        nombre: data.nombre,
        email: data.email,
        cargo: data.cargo,
        rol: data.rol ? (data.rol as PrismaRole) : undefined,
        estado: data.estado ? (data.estado as PrismaUserStatus) : undefined,
        permisos: data.permisos ? data.permisos : undefined,
        passwordHash: data.passwordHash ? data.passwordHash : undefined,
      },
    });
    return this.mapToEntity(updated);
  }
}

