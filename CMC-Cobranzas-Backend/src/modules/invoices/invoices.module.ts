import { Module } from '@nestjs/common';
import { PrismaModule } from '../../context/database/prisma.module';
import { InvoicesController } from './api/controllers/invoices.controller';
import { INVOICE_REPOSITORY } from './domain/interfaces/invoice-repository.port';
import { PrismaInvoiceRepository } from './infrastructure/repositories/prisma-invoice.repository';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { FindInvoicesUseCase } from './application/use-cases/find-invoices.use-case';
import { FindInvoiceByIdUseCase } from './application/use-cases/find-invoice-by-id.use-case';
import { UpdateInvoiceStatusUseCase } from './application/use-cases/update-invoice-status.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [InvoicesController],
  providers: [
    {
      provide: INVOICE_REPOSITORY,
      useClass: PrismaInvoiceRepository,
    },
    CreateInvoiceUseCase,
    FindInvoicesUseCase,
    FindInvoiceByIdUseCase,
    UpdateInvoiceStatusUseCase,
  ],
  exports: [INVOICE_REPOSITORY, FindInvoicesUseCase],
})
export class InvoicesModule {}

