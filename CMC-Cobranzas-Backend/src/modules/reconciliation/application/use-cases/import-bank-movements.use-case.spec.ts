import { ImportBankMovementsUseCase } from './import-bank-movements.use-case';
import { BankMovementRepositoryPort } from '../../domain/interfaces/bank-movement-repository.port';

describe('ImportBankMovementsUseCase', () => {
  let useCase: ImportBankMovementsUseCase;
  let mockRepo: jest.Mocked<BankMovementRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      createMany: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByTransaction: jest.fn(),
      updateStatus: jest.fn(),
      findPendingMovements: jest.fn(),
    };
    useCase = new ImportBankMovementsUseCase(mockRepo);
  });

  it('should process bank statement and report inserted vs duplicate movements', async () => {
    mockRepo.createMany.mockResolvedValueOnce({ inserted: 2, duplicates: 1 });

    const result = await useCase.execute({
      banco: 'Banco Pichincha',
      movimientos: [
        {
          fecha: new Date('2026-11-06T10:00:00Z'),
          monto: 150.0,
          numeroTransaccion: 'TRX-101',
          referencia: 'Pago cuota 1',
        },
        {
          fecha: new Date('2026-11-06T11:00:00Z'),
          monto: 200.0,
          numeroTransaccion: 'TRX-102',
          referencia: 'Pago cuota 2',
        },
        {
          fecha: new Date('2026-11-06T12:00:00Z'),
          monto: 50.0,
          numeroTransaccion: 'TRX-103',
          referencia: 'Pago cuota 3',
        },
      ],
    });

    expect(result).toEqual({
      banco: 'Banco Pichincha',
      totalReceived: 3,
      inserted: 2,
      duplicates: 1,
    });
    expect(mockRepo.createMany).toHaveBeenCalledTimes(1);
  });
});

