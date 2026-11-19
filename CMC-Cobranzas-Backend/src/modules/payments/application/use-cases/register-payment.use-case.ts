import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DEBT_REPOSITORY_PORT, DebtRepositoryPort } from '../../../debts/domain/interfaces/debt-repository.port';
import { CreatePaymentData, PAYMENT_REPOSITORY_PORT, PaymentRepositoryPort } from '../../domain/interfaces/payment-repository.port';
import { STORAGE_PORT, StoragePort } from '../../domain/interfaces/storage.port';
import { PaymentEntity } from '../../domain/types/payment.type';
import { CreatePaymentDto } from '../../api/dtos/create-payment.dto';

@Injectable()
export class RegisterPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT) private readonly paymentRepo: PaymentRepositoryPort,
    @Inject(DEBT_REPOSITORY_PORT) private readonly debtRepo: DebtRepositoryPort,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  async execute(dto: CreatePaymentDto, file?: Express.Multer.File): Promise<PaymentEntity> {
    const debt = await this.debtRepo.findById(dto.deudaId);
    if (!debt) throw new NotFoundException(`Deuda con ID ${dto.deudaId} no encontrada`);
    if (debt.estado === 'ANULADA') throw new BadRequestException('No se pueden registrar pagos a una deuda anulada');
    if (debt.estado === 'PAGADA' || debt.saldoActual <= 0) {
      throw new BadRequestException('La deuda ya se encuentra totalmente saldada');
    }
    if (debt.clienteId !== dto.clienteId) {
      throw new BadRequestException('El cliente no coincide con el titular de la deuda');
    }
    if (dto.monto > debt.saldoActual) {
      throw new BadRequestException(`El monto ($${dto.monto}) supera el saldo pendiente ($${debt.saldoActual})`);
    }

    let comprobanteUrl: string | null = null;
    if (file) {
      comprobanteUrl = await this.storage.uploadFile({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });
    }

    const nuevoSaldo = Math.round((debt.saldoActual - dto.monto) * 100) / 100;
    const nuevoEstado = nuevoSaldo <= 0 ? 'PAGADA' : 'PARCIAL';

    const paymentData: CreatePaymentData = {
      ...dto,
      comprobanteUrl,
    };

    return this.paymentRepo.createWithDebtAmortization(paymentData, nuevoSaldo, nuevoEstado);
  }
}
