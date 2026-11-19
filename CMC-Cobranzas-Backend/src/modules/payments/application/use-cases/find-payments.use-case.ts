import { Inject, Injectable } from '@nestjs/common';
import { FindPaymentsParams, PAYMENT_REPOSITORY_PORT, PaymentRepositoryPort } from '../../domain/interfaces/payment-repository.port';
import { PaymentEntity } from '../../domain/types/payment.type';

@Injectable()
export class FindPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT) private readonly paymentRepo: PaymentRepositoryPort,
  ) {}

  async execute(params?: FindPaymentsParams): Promise<{ items: PaymentEntity[]; total: number }> {
    return this.paymentRepo.findAll(params);
  }
}

