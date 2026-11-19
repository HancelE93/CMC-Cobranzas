import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../context/database/prisma.service';
import {
  INVOICE_REPOSITORY,
  InvoiceRepositoryPort,
} from '../../domain/interfaces/invoice-repository.port';
import { CreateInvoiceDto } from '../../api/dtos/create-invoice.dto';
import { InvoiceEntity } from '../../domain/types/invoice.entity';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly repo: InvoiceRepositoryPort,
    private readonly prisma: PrismaService,
  ) {}

  async execute(dto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const existing = await this.repo.findByNumero(dto.numeroFactura);
    if (existing) {
      throw new ConflictException('El numero de factura ya se encuentra registrado');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: dto.clienteId },
    });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (dto.deudaId) {
      const debt = await this.prisma.debt.findUnique({
        where: { id: dto.deudaId },
      });
      if (!debt) {
        throw new NotFoundException('Deuda asociada no encontrada');
      }
    }

    return this.repo.create({
      clienteId: dto.clienteId,
      deudaId: dto.deudaId,
      numeroFactura: dto.numeroFactura.trim(),
      fechaFactura: new Date(dto.fechaFactura),
      monto: dto.monto,
      estadoDocumental: dto.estadoDocumental,
      observaciones: dto.observaciones?.trim(),
    });
  }
}

