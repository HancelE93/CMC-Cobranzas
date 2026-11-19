import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';
import { DebtsController } from './api/controllers/debts.controller';
import { CreateDebtUseCase } from './application/use-cases/create-debt.use-case';
import { FindDebtByIdUseCase } from './application/use-cases/find-debt-by-id.use-case';
import { FindDebtsUseCase } from './application/use-cases/find-debts.use-case';
import { UpdateDebtUseCase } from './application/use-cases/update-debt.use-case';
import { DEBT_REPOSITORY_PORT } from './domain/interfaces/debt-repository.port';
import { PrismaDebtRepository } from './infrastructure/repositories/prisma-debt.repository';

@Module({
  imports: [ClientsModule, ProductsModule],
  controllers: [DebtsController],
  providers: [
    CreateDebtUseCase,
    FindDebtsUseCase,
    FindDebtByIdUseCase,
    UpdateDebtUseCase,
    {
      provide: DEBT_REPOSITORY_PORT,
      useClass: PrismaDebtRepository,
    },
  ],
  exports: [DEBT_REPOSITORY_PORT, FindDebtByIdUseCase],
})
export class DebtsModule {}

