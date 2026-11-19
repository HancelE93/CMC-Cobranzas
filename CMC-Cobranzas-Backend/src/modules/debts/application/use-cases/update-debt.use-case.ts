import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDebtDto } from '../../api/dtos/update-debt.dto';
import {
  DEBT_REPOSITORY_PORT,
  DebtRepositoryPort,
} from '../../domain/interfaces/debt-repository.port';
import { DebtEntity } from '../../domain/types/debt.type';

@Injectable()
export class UpdateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY_PORT)
    private readonly debtRepo: DebtRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateDebtDto): Promise<DebtEntity> {
    const existing = await this.debtRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Deuda con ID ${id} no encontrada`);
    }

    return this.debtRepo.update(id, dto);
  }
}

