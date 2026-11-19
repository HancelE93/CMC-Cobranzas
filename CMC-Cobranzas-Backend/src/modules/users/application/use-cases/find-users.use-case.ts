import { Inject, Injectable } from '@nestjs/common';
import { UserQueryDto } from '../../api/dtos/user-query.dto';
import {
  USER_ADMIN_REPOSITORY_PORT,
  UserAdminRepositoryPort,
} from '../../domain/interfaces/user-admin-repository.port';

@Injectable()
export class FindUsersUseCase {
  constructor(
    @Inject(USER_ADMIN_REPOSITORY_PORT)
    private readonly userRepo: UserAdminRepositoryPort,
  ) {}

  async execute(query: UserQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.userRepo.findAll({
      search: query.search,
      rol: query.rol,
      estado: query.estado,
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}

