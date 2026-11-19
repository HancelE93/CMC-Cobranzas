import { Inject, Injectable } from '@nestjs/common';
import {
  CASHFLOW_REPOSITORY,
  CashFlowRepositoryPort,
} from '../../domain/interfaces/cashflow-repository.port';
import { CashFlowQueryDto } from '../../api/dtos/cashflow-query.dto';
import { CashFlowReport } from '../../domain/types/cashflow.type';

@Injectable()
export class GetCashFlowReportUseCase {
  constructor(
    @Inject(CASHFLOW_REPOSITORY)
    private readonly repo: CashFlowRepositoryPort,
  ) {}

  async execute(query?: CashFlowQueryDto): Promise<CashFlowReport> {
    const now = new Date();
    const year = query?.year || now.getUTCFullYear();
    const month = query?.month || now.getUTCMonth() + 1;

    return this.repo.generateReport(year, month);
  }
}

