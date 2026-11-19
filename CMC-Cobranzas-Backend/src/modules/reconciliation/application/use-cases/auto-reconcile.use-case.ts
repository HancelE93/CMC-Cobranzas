import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import {
  BANK_MOVEMENT_REPOSITORY,
  BankMovementRepositoryPort,
} from '../../domain/interfaces/bank-movement-repository.port';

export interface AutoReconcileResult {
  totalProcessed: number;
  reconciled: number;
  unmatched: number;
}

@Injectable()
export class AutoReconcileUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankRepo: BankMovementRepositoryPort,
    private readonly prisma: PrismaService,
  ) {}

  async execute(banco?: string): Promise<AutoReconcileResult> {
    const pending = await this.bankRepo.findPendingMovements(banco);
    let reconciled = 0;

    for (const mov of pending) {
      const match = await this.prisma.payment.findFirst({
        where: {
          numeroTransaccion: mov.numeroTransaccion,
          estadoConciliacion: 'PENDIENTE',
        },
      });

      if (!match) continue;

      const diff = Math.abs(Number(match.monto) - mov.monto);
      if (diff > 0.01) continue;

      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.reconciliation.create({
          data: {
            pagoId: match.id,
            movimientoBancarioId: mov.id,
            tipo: 'automatica',
            estado: 'conciliado',
            reglaCoincidencia: 'NUMERO_Y_MONTO',
          },
        });

        await tx.payment.update({
          where: { id: match.id },
          data: { estadoConciliacion: 'CONCILIADO_AUTO' },
        });

        await tx.bankMovement.update({
          where: { id: mov.id },
          data: { estado: 'conciliado' },
        });
      });

      reconciled++;
    }

    return {
      totalProcessed: pending.length,
      reconciled,
      unmatched: pending.length - reconciled,
    };
  }
}

