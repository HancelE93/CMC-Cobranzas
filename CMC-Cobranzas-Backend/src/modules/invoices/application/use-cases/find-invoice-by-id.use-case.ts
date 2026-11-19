import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INVOICE_REPOSITORY,
  InvoiceRepositoryPort,
} from '../../domain/interfaces/invoice-repository.port';
import { InvoiceEntity } from '../../domain/types/invoice.entity';

@Injectable()
export class FindInvoiceByIdUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repo: InvoiceRepositoryPort,
  ) {}

  async execute(id: string): Promise<InvoiceEntity> {
    const item = await this.repo.findById(id);
    if (!item) {
      throw new NotFoundException('Factura no encontrada');
    }
    return item;
  }
}

