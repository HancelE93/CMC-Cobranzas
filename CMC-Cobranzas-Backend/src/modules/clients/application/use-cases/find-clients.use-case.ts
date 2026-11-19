import { Inject, Injectable } from '@nestjs/common';
import { ClientQueryDto } from '../../api/dtos/client-query.dto';
import {
  CLIENT_REPOSITORY_PORT,
  ClientRepositoryPort,
} from '../../domain/interfaces/client-repository.port';

@Injectable()
export class FindClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_PORT)
    private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(query: ClientQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.clientRepo.findAll({
      search: query.search,
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

