import { Module } from '@nestjs/common';
import { PrismaModule } from '../../context/database/prisma.module';
import { CashFlowController } from './api/controllers/cashflow.controller';
import { CASHFLOW_REPOSITORY } from './domain/interfaces/cashflow-repository.port';
import { PrismaCashFlowRepository } from './infrastructure/repositories/prisma-cashflow.repository';
import { GetCashFlowReportUseCase } from './application/use-cases/get-cashflow-report.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [CashFlowController],
  providers: [
    {
      provide: CASHFLOW_REPOSITORY,
      useClass: PrismaCashFlowRepository,
    },
    GetCashFlowReportUseCase,
  ],
  exports: [CASHFLOW_REPOSITORY, GetCashFlowReportUseCase],
})
export class CashFlowModule {}

