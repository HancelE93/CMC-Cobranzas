import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PAYMENT_REPOSITORY_PORT, PaymentRepositoryPort } from '../../domain/interfaces/payment-repository.port';
import { PaymentEntity } from '../../domain/types/payment.type';

@Injectable()
export class FindPaymentByIdUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT) private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(id: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return payment;
  }
}

