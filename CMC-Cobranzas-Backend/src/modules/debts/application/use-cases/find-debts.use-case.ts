import { Inject, Injectable } from '@nestjs/common';
import { DebtQueryDto } from '../../api/dtos/debt-query.dto';
import {
  DEBT_REPOSITORY_PORT,
  DebtRepositoryPort,
} from '../../domain/interfaces/debt-repository.port';

@Injectable()
export class FindDebtsUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY_PORT)
    private readonly debtRepo: DebtRepositoryPort,
  ) {}

  async execute(query: DebtQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.debtRepo.findAll({
      clienteId: query.clienteId,
      productoId: query.productoId,
      estado: query.estado,
      search: query.search,
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

