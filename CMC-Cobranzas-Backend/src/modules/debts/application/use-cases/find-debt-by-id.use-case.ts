import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DEBT_REPOSITORY_PORT,
  DebtRepositoryPort,
} from '../../domain/interfaces/debt-repository.port';
import { DebtEntity } from '../../domain/types/debt.type';

@Injectable()
export class FindDebtByIdUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY_PORT)
    private readonly debtRepo: DebtRepositoryPort,
  ) {}

  async execute(id: string): Promise<DebtEntity> {
    const debt = await this.debtRepo.findById(id);
    if (!debt) {
      throw new NotFoundException(`Deuda con ID ${id} no encontrada`);
    }
    return debt;
  }
}

