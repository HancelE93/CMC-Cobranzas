import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtDto } from '../../api/dtos/create-debt.dto';
import {
  CLIENT_REPOSITORY_PORT,
  ClientRepositoryPort,
} from '../../../clients/domain/interfaces/client-repository.port';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../../products/domain/interfaces/product-repository.port';
import {
  DEBT_REPOSITORY_PORT,
  DebtRepositoryPort,
} from '../../domain/interfaces/debt-repository.port';
import { DebtEntity } from '../../domain/types/debt.type';
import { calculateInstallments } from '../../domain/utils/installment-calculator.util';

@Injectable()
export class CreateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY_PORT)
    private readonly debtRepo: DebtRepositoryPort,
    @Inject(CLIENT_REPOSITORY_PORT)
    private readonly clientRepo: ClientRepositoryPort,
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(dto: CreateDebtDto): Promise<DebtEntity> {
    const client = await this.clientRepo.findById(dto.clienteId);
    if (!client) throw new NotFoundException('El cliente especificado no existe');
    if (client.estado !== 'ACTIVO') throw new BadRequestException('El cliente no está ACTIVO');

    const product = await this.productRepo.findById(dto.productoId);
    if (!product) throw new NotFoundException('El producto especificado no existe');
    if (product.estado !== 'ACTIVO') throw new BadRequestException('El producto no está ACTIVO');

    const nominalPrice = dto.precioNominalAplicado ?? product.precioNominal;
    const acquisitionDate = new Date(dto.fechaAdquisicion);
    const installments = dto.plazoMeses
      ? calculateInstallments(dto.precioAcordado, dto.plazoMeses, dto.diaCorte ?? 15, acquisitionDate)
      : null;

    return this.debtRepo.create({
      clienteId: dto.clienteId,
      productoId: dto.productoId,
      fechaAdquisicion: acquisitionDate,
      precioNominalAplicado: nominalPrice,
      precioAcordado: dto.precioAcordado,
      saldoInicial: dto.precioAcordado,
      saldoActual: dto.precioAcordado,
      metodoPago: dto.metodoPago ?? null,
      plazoMeses: dto.plazoMeses ?? null,
      diaCorte: dto.diaCorte ?? null,
      cuotas: installments,
      observaciones: dto.observaciones ?? null,
      estado: 'PENDIENTE',
    });
  }
}

