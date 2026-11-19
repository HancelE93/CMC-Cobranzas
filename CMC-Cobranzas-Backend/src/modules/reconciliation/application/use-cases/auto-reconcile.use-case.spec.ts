import { AutoReconcileUseCase } from './auto-reconcile.use-case';
import { BankMovementRepositoryPort } from '../../domain/interfaces/bank-movement-repository.port';
import { PrismaService } from '../../../../context/database/prisma.service';

describe('AutoReconcileUseCase', () => {
  let useCase: AutoReconcileUseCase;
  let mockBankRepo: jest.Mocked<BankMovementRepositoryPort>;
  let mockPrisma: any;

  beforeEach(() => {
    mockBankRepo = {
      createMany: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByTransaction: jest.fn(),
      updateStatus: jest.fn(),
      findPendingMovements: jest.fn(),
    };
    mockPrisma = {
      payment: { findFirst: jest.fn(), update: jest.fn() },
      bankMovement: { update: jest.fn() },
      reconciliation: { create: jest.fn() },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };
    useCase = new AutoReconcileUseCase(mockBankRepo, mockPrisma as PrismaService);
  });

  it('should reconcile matching payments and movements automatically', async () => {
    mockBankRepo.findPendingMovements.mockResolvedValueOnce([
      {
        id: 'mov-1',
        fecha: new Date(),
        monto: 120.0,
        numeroTransaccion: 'TRX-999',
        referencia: null,
        ordenante: null,
        banco: 'Banco Guayaquil',
        estado: 'sin_asignar',
        createdAt: new Date(),
      },
    ]);

    mockPrisma.payment.findFirst.mockResolvedValueOnce({
      id: 'pay-1',
      numeroTransaccion: 'TRX-999',
      monto: 120.0,
      estadoConciliacion: 'PENDIENTE',
    });

    const result = await useCase.execute('Banco Guayaquil');

    expect(result).toEqual({
      totalProcessed: 1,
      reconciled: 1,
      unmatched: 0,
    });
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.payment.update).toHaveBeenCalledWith({
      where: { id: 'pay-1' },
      data: { estadoConciliacion: 'CONCILIADO_AUTO' },
    });
  });
});

