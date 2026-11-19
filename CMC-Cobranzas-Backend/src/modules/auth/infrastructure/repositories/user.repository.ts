import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { UserRepositoryPort } from '../../domain/interfaces/user-repository.port';
import { CreateUserData, UserEntity } from '../../domain/types/user.type';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsernameOrEmail(identifier: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });
    return user ? (user as unknown as UserEntity) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? (user as unknown as UserEntity) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        nombre: data.nombre,
        cargo: data.cargo,
        rol: (data.rol as Role) || Role.COBRADOR,
      },
    });
    return user as unknown as UserEntity;
  }
}

