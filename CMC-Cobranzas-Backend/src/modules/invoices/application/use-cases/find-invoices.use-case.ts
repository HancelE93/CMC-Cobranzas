import { Inject, Injectable } from '@nestjs/common';
import {
  INVOICE_REPOSITORY,
  InvoiceRepositoryPort,
} from '../../domain/interfaces/invoice-repository.port';
import { InvoiceQueryDto } from '../../api/dtos/invoice-query.dto';
import { InvoiceEntity } from '../../domain/types/invoice.entity';

@Injectable()
export class FindInvoicesUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repo: InvoiceRepositoryPort,
  ) {}

  async execute(query?: InvoiceQueryDto): Promise<InvoiceEntity[]> {
    return this.repo.findAll({
      clienteId: query?.clienteId,
      deudaId: query?.deudaId,
      estadoDocumental: query?.estadoDocumental,
      fechaDesde: query?.fechaDesde,
      fechaHasta: query?.fechaHasta,
    });
  }
}

