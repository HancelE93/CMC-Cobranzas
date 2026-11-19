import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceUseCase } from './create-invoice.use-case';
import { InvoiceRepositoryPort } from '../../domain/interfaces/invoice-repository.port';
import { PrismaService } from '../../../../context/database/prisma.service';

describe('CreateInvoiceUseCase', () => {
  let useCase: CreateInvoiceUseCase;
  let mockRepo: jest.Mocked<InvoiceRepositoryPort>;
  let mockPrisma: any;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByNumero: jest.fn(),
      updateEstado: jest.fn(),
    };
    mockPrisma = {
      client: { findUnique: jest.fn() },
      debt: { findUnique: jest.fn() },
    };
    useCase = new CreateInvoiceUseCase(mockRepo, mockPrisma as PrismaService);
  });

  it('should throw ConflictException if invoice number already exists', async () => {
    mockRepo.findByNumero.mockResolvedValueOnce({
      id: 'inv-1',
      numeroFactura: '001-001-00001',
    } as any);

    await expect(
      useCase.execute({
        clienteId: 'cli-1',
        numeroFactura: '001-001-00001',
        fechaFactura: new Date(),
        monto: 300,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if client does not exist', async () => {
    mockRepo.findByNumero.mockResolvedValueOnce(null);
    mockPrisma.client.findUnique.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({
        clienteId: 'non-existent-client',
        numeroFactura: '001-001-00002',
        fechaFactura: new Date(),
        monto: 300,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create invoice successfully when valid', async () => {
    mockRepo.findByNumero.mockResolvedValueOnce(null);
    mockPrisma.client.findUnique.mockResolvedValueOnce({ id: 'cli-1' });
    mockRepo.create.mockResolvedValueOnce({
      id: 'inv-2',
      clienteId: 'cli-1',
      numeroFactura: '001-001-00002',
      monto: 300,
    } as any);

    const result = await useCase.execute({
      clienteId: 'cli-1',
      numeroFactura: '001-001-00002',
      fechaFactura: new Date(),
      monto: 300,
    });

    expect(result.id).toBe('inv-2');
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});

