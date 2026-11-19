import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DebtRepositoryPort } from '../../../debts/domain/interfaces/debt-repository.port';
import { DebtEntity } from '../../../debts/domain/types/debt.type';
import { PaymentRepositoryPort } from '../../domain/interfaces/payment-repository.port';
import { StoragePort } from '../../domain/interfaces/storage.port';
import { PaymentEntity } from '../../domain/types/payment.type';
import { RegisterPaymentUseCase } from './register-payment.use-case';

describe('RegisterPaymentUseCase', () => {
  let useCase: RegisterPaymentUseCase;
  let mockPaymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let mockDebtRepo: jest.Mocked<DebtRepositoryPort>;
  let mockStorage: jest.Mocked<StoragePort>;

  const mockDebt: DebtEntity = {
    id: 'debt-123',
    clienteId: 'client-1',
    productoId: 'prod-1',
    fechaAdquisicion: new Date(),
    precioNominalAplicado: 500,
    precioAcordado: 500,
    saldoInicial: 500,
    saldoActual: 500,
    estado: 'PENDIENTE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPaymentRepo = {
      createWithDebtAmortization: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    mockDebtRepo = {
      findById: jest.fn().mockResolvedValue({ ...mockDebt }),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      updateSaldo: jest.fn(),
    };
    mockStorage = {
      uploadFile: jest.fn().mockResolvedValue('https://cloudflare.r2/comprobante.jpg'),
      getFile: jest.fn().mockResolvedValue(null),
    };
    useCase = new RegisterPaymentUseCase(mockPaymentRepo, mockDebtRepo, mockStorage);
  });

  it('debe registrar un abono parcial amortizando el saldo de la deuda', async () => {
    mockPaymentRepo.createWithDebtAmortization.mockResolvedValueOnce({
      id: 'pay-1',
      deudaId: 'debt-123',
      clienteId: 'client-1',
      monto: 200,
      fechaPago: new Date(),
      metodo: 'TRANSFERENCIA',
      estadoRegistro: 'REGISTRADO',
      estadoConciliacion: 'PENDIENTE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute({
      deudaId: 'debt-123',
      clienteId: 'client-1',
      monto: 200,
      fechaPago: new Date(),
      metodo: 'TRANSFERENCIA',
    });

    expect(result.id).toBe('pay-1');
    expect(mockPaymentRepo.createWithDebtAmortization).toHaveBeenCalledWith(
      expect.objectContaining({ monto: 200 }),
      300,
      'PARCIAL',
    );
  });

  it('debe liquidar la deuda (estado PAGADA y saldo 0) cuando el monto cubre el saldo total', async () => {
    mockDebtRepo.findById.mockResolvedValueOnce({ ...mockDebt, saldoActual: 150 });
    mockPaymentRepo.createWithDebtAmortization.mockResolvedValueOnce({
      id: 'pay-2',
      monto: 150,
    } as PaymentEntity);

    await useCase.execute({
      deudaId: 'debt-123',
      clienteId: 'client-1',
      monto: 150,
      fechaPago: new Date(),
      metodo: 'EFECTIVO',
    });

    expect(mockPaymentRepo.createWithDebtAmortization).toHaveBeenCalledWith(
      expect.objectContaining({ monto: 150 }),
      0,
      'PAGADA',
    );
  });

  it('debe subir comprobante a almacenamiento si se proporciona archivo', async () => {
    const fakeFile = {
      buffer: Buffer.from('fake-image-bytes'),
      originalname: 'comprobante_banco.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    mockPaymentRepo.createWithDebtAmortization.mockResolvedValueOnce({ id: 'pay-3' } as PaymentEntity);

    await useCase.execute(
      {
        deudaId: 'debt-123',
        clienteId: 'client-1',
        monto: 100,
        fechaPago: new Date(),
        metodo: 'TRANSFERENCIA',
      },
      fakeFile,
    );

    expect(mockStorage.uploadFile).toHaveBeenCalled();
    expect(mockPaymentRepo.createWithDebtAmortization).toHaveBeenCalledWith(
      expect.objectContaining({ comprobanteUrl: 'https://cloudflare.r2/comprobante.jpg' }),
      400,
      'PARCIAL',
    );
  });

  it('debe lanzar BadRequestException si el monto supera el saldo de la deuda', async () => {
    await expect(
      useCase.execute({
        deudaId: 'debt-123',
        clienteId: 'client-1',
        monto: 600,
        fechaPago: new Date(),
        metodo: 'TRANSFERENCIA',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe lanzar NotFoundException si la deuda no existe', async () => {
    mockDebtRepo.findById.mockResolvedValueOnce(null);
    await expect(
      useCase.execute({
        deudaId: 'debt-inexistente',
        clienteId: 'client-1',
        monto: 100,
        fechaPago: new Date(),
        metodo: 'TRANSFERENCIA',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
