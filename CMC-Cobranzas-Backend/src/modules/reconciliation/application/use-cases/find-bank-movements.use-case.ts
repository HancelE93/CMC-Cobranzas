import { Inject, Injectable } from '@nestjs/common';
import {
  BANK_MOVEMENT_REPOSITORY,
  BankMovementRepositoryPort,
} from '../../domain/interfaces/bank-movement-repository.port';
import { BankMovementQueryDto } from '../../api/dtos/bank-movement-query.dto';
import { BankMovementEntity } from '../../domain/types/bank-movement.entity';

@Injectable()
export class FindBankMovementsUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly repo: BankMovementRepositoryPort,
  ) {}

  async execute(query?: BankMovementQueryDto): Promise<BankMovementEntity[]> {
    return this.repo.findAll({
      banco: query?.banco,
      estado: query?.estado,
      fechaDesde: query?.fechaDesde,
      fechaHasta: query?.fechaHasta,
    });
  }
}

