import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserAdminDto } from '../../api/dtos/create-user-admin.dto';
import {
  USER_ADMIN_REPOSITORY_PORT,
  UserAdminRepositoryPort,
} from '../../domain/interfaces/user-admin-repository.port';
import { UserAdminEntity } from '../../domain/types/user-admin.type';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_ADMIN_REPOSITORY_PORT)
    private readonly userRepo: UserAdminRepositoryPort,
  ) {}

  async execute(dto: CreateUserAdminDto): Promise<UserAdminEntity> {
    const existingUsername = await this.userRepo.findByUsernameOrEmail(dto.username);
    if (existingUsername) {
      throw new ConflictException(`El usuario ${dto.username} ya se encuentra registrado`);
    }

    const existingEmail = await this.userRepo.findByUsernameOrEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException(`El correo ${dto.email} ya se encuentra registrado`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.userRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      nombre: dto.nombre,
      cargo: dto.cargo,
      rol: dto.rol,
      estado: dto.estado ?? 'ACTIVO',
      permisos: dto.permisos ?? null,
    });
  }
}

