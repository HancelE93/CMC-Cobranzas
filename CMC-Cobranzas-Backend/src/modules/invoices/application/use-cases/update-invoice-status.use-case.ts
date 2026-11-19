import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INVOICE_REPOSITORY,
  InvoiceRepositoryPort,
} from '../../domain/interfaces/invoice-repository.port';
import { InvoiceEntity } from '../../domain/types/invoice.entity';

@Injectable()
export class UpdateInvoiceStatusUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repo: InvoiceRepositoryPort,
  ) {}

  async execute(id: string, estadoDocumental: string): Promise<InvoiceEntity> {
    const item = await this.repo.findById(id);
    if (!item) {
      throw new NotFoundException('Factura no encontrada');
    }
    return this.repo.updateEstado(id, estadoDocumental);
  }
}

