import { Module } from '@nestjs/common';
import { PrismaModule } from '../../context/database/prisma.module';
import { ReconciliationController } from './api/controllers/reconciliation.controller';
import { BANK_MOVEMENT_REPOSITORY } from './domain/interfaces/bank-movement-repository.port';
import { RECONCILIATION_REPOSITORY } from './domain/interfaces/reconciliation-repository.port';
import { PrismaBankMovementRepository } from './infrastructure/repositories/prisma-bank-movement.repository';
import { PrismaReconciliationRepository } from './infrastructure/repositories/prisma-reconciliation.repository';
import { ImportBankMovementsUseCase } from './application/use-cases/import-bank-movements.use-case';
import { FindBankMovementsUseCase } from './application/use-cases/find-bank-movements.use-case';
import { AutoReconcileUseCase } from './application/use-cases/auto-reconcile.use-case';
import { ManualReconcileUseCase } from './application/use-cases/manual-reconcile.use-case';
import { FindReconciliationsUseCase } from './application/use-cases/find-reconciliations.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [ReconciliationController],
  providers: [
    {
      provide: BANK_MOVEMENT_REPOSITORY,
      useClass: PrismaBankMovementRepository,
    },
    {
      provide: RECONCILIATION_REPOSITORY,
      useClass: PrismaReconciliationRepository,
    },
    ImportBankMovementsUseCase,
    FindBankMovementsUseCase,
    AutoReconcileUseCase,
    ManualReconcileUseCase,
    FindReconciliationsUseCase,
  ],
  exports: [
    BANK_MOVEMENT_REPOSITORY,
    RECONCILIATION_REPOSITORY,
    FindBankMovementsUseCase,
  ],
})
export class ReconciliationModule {}

