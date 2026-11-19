import { Inject, Injectable } from '@nestjs/common';
import {
  RECONCILIATION_REPOSITORY,
  ReconciliationRepositoryPort,
} from '../../domain/interfaces/reconciliation-repository.port';
import { ReconciliationEntity } from '../../domain/types/reconciliation.entity';

@Injectable()
export class FindReconciliationsUseCase {
  constructor(
    @Inject(RECONCILIATION_REPOSITORY)
    private readonly repo: ReconciliationRepositoryPort,
  ) {}

  async execute(): Promise<ReconciliationEntity[]> {
    return this.repo.findAll();
  }
}

