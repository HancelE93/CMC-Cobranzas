import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserAdminDto } from '../../api/dtos/update-user-admin.dto';
import {
  USER_ADMIN_REPOSITORY_PORT,
  UserAdminRepositoryPort,
} from '../../domain/interfaces/user-admin-repository.port';
import { UserAdminEntity } from '../../domain/types/user-admin.type';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_ADMIN_REPOSITORY_PORT)
    private readonly userRepo: UserAdminRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateUserAdminDto): Promise<UserAdminEntity> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.userRepo.update(id, {
      nombre: dto.nombre,
      email: dto.email,
      cargo: dto.cargo,
      rol: dto.rol,
      estado: dto.estado,
      permisos: dto.permisos,
      ...(passwordHash ? { passwordHash } : {}),
    });
  }
}

