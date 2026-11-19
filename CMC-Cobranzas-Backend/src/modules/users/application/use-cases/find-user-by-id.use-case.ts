import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USER_ADMIN_REPOSITORY_PORT,
  UserAdminRepositoryPort,
} from '../../domain/interfaces/user-admin-repository.port';
import { UserAdminEntity } from '../../domain/types/user-admin.type';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_ADMIN_REPOSITORY_PORT)
    private readonly userRepo: UserAdminRepositoryPort,
  ) {}

  async execute(id: string): Promise<UserAdminEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
}

