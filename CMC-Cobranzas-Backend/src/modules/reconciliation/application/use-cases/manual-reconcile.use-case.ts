import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../context/database/prisma.service';
import { ManualReconciliationDto } from '../../api/dtos/manual-reconciliation.dto';
import { ReconciliationEntity } from '../../domain/types/reconciliation.entity';

@Injectable()
export class ManualReconcileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    dto: ManualReconciliationDto,
    username?: string,
  ): Promise<ReconciliationEntity> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.pagoId },
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');

    const movement = await this.prisma.bankMovement.findUnique({
      where: { id: dto.movimientoBancarioId },
    });
    if (!movement)
      throw new NotFoundException('Movimiento bancario no encontrado');

    if (movement.estado === 'conciliado') {
      throw new BadRequestException('El movimiento bancario ya esta conciliado');
    }

    const created = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const item = await tx.reconciliation.create({
          data: {
            pagoId: dto.pagoId,
            movimientoBancarioId: dto.movimientoBancarioId,
            tipo: 'manual',
            estado: 'conciliado',
            observacion: dto.observacion,
            conciliadoPor: username || 'sistema',
          },
        });

        await tx.payment.update({
          where: { id: dto.pagoId },
          data: { estadoConciliacion: 'CONCILIADO_MANUAL' },
        });

        await tx.bankMovement.update({
          where: { id: dto.movimientoBancarioId },
          data: { estado: 'conciliado' },
        });

        return item;
      },
    );

    return {
      id: created.id,
      pagoId: created.pagoId,
      movimientoBancarioId: created.movimientoBancarioId,
      tipo: created.tipo,
      estado: created.estado,
      reglaCoincidencia: created.reglaCoincidencia,
      observacion: created.observacion,
      fechaConciliacion: created.fechaConciliacion,
      conciliadoPor: created.conciliadoPor,
      createdAt: created.createdAt,
    };
  }
}

