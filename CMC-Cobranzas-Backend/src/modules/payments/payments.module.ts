import { Module } from '@nestjs/common';
import { PrismaModule } from '../../context/database/prisma.module';
import { DebtsModule } from '../debts/debts.module';
import { PaymentsController } from './api/controllers/payments.controller';
import { FindPaymentByIdUseCase } from './application/use-cases/find-payment-by-id.use-case';
import { FindPaymentsUseCase } from './application/use-cases/find-payments.use-case';
import { RegisterPaymentUseCase } from './application/use-cases/register-payment.use-case';
import { PAYMENT_REPOSITORY_PORT } from './domain/interfaces/payment-repository.port';
import { STORAGE_PORT } from './domain/interfaces/storage.port';
import { CloudflareR2Adapter } from './infrastructure/adapters/cloudflare-r2.adapter';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';

@Module({
  imports: [PrismaModule, DebtsModule],
  controllers: [PaymentsController],
  providers: [
    RegisterPaymentUseCase,
    FindPaymentsUseCase,
    FindPaymentByIdUseCase,
    {
      provide: PAYMENT_REPOSITORY_PORT,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: STORAGE_PORT,
      useClass: CloudflareR2Adapter,
    },
  ],
  exports: [PAYMENT_REPOSITORY_PORT, STORAGE_PORT, FindPaymentByIdUseCase, FindPaymentsUseCase],
})
export class PaymentsModule {}

