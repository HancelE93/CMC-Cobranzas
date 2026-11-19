import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateDebtUseCase } from './create-debt.use-case';
import { DebtRepositoryPort } from '../../domain/interfaces/debt-repository.port';
import { ClientRepositoryPort } from '../../../clients/domain/interfaces/client-repository.port';
import { ProductRepositoryPort } from '../../../products/domain/interfaces/product-repository.port';
import { DebtEntity } from '../../domain/types/debt.type';

describe('CreateDebtUseCase', () => {
  let useCase: CreateDebtUseCase;
  let mockDebtRepo: jest.Mocked<DebtRepositoryPort>;
  let mockClientRepo: jest.Mocked<ClientRepositoryPort>;
  let mockProductRepo: jest.Mocked<ProductRepositoryPort>;

  beforeEach(() => {
    mockDebtRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      updateSaldo: jest.fn(),
    };
    mockClientRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCedula: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    mockProductRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CreateDebtUseCase(mockDebtRepo, mockClientRepo, mockProductRepo);
  });

  it('should throw NotFoundException if client does not exist', async () => {
    mockClientRepo.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        clienteId: 'c1',
        productoId: 'p1',
        precioAcordado: 200,
        fechaAdquisicion: '2026-11-01',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if client is inactive', async () => {
    mockClientRepo.findById.mockResolvedValueOnce({ id: 'c1', estado: 'INACTIVO' } as any);

    await expect(
      useCase.execute({
        clienteId: 'c1',
        productoId: 'p1',
        precioAcordado: 200,
        fechaAdquisicion: '2026-11-01',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create debt and generate installments successfully', async () => {
    mockClientRepo.findById.mockResolvedValueOnce({ id: 'c1', estado: 'ACTIVO' } as any);
    mockProductRepo.findById.mockResolvedValueOnce({
      id: 'p1',
      estado: 'ACTIVO',
      precioNominal: 250,
    } as any);

    const mockCreated: DebtEntity = {
      id: 'd1',
      clienteId: 'c1',
      productoId: 'p1',
      fechaAdquisicion: new Date('2026-11-01'),
      precioNominalAplicado: 250,
      precioAcordado: 200,
      saldoInicial: 200,
      saldoActual: 200,
      plazoMeses: 2,
      diaCorte: 15,
      estado: 'PENDIENTE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDebtRepo.create.mockResolvedValueOnce(mockCreated);

    const result = await useCase.execute({
      clienteId: 'c1',
      productoId: 'p1',
      precioAcordado: 200,
      fechaAdquisicion: '2026-11-01',
      plazoMeses: 2,
      diaCorte: 15,
    });

    expect(result).toEqual(mockCreated);
    expect(mockDebtRepo.create).toHaveBeenCalledTimes(1);
  });
});

