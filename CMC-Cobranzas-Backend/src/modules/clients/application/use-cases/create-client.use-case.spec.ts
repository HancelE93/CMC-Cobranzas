import { ConflictException } from '@nestjs/common';
import { CreateClientUseCase } from './create-client.use-case';
import { ClientRepositoryPort } from '../../domain/interfaces/client-repository.port';
import { ClientEntity } from '../../domain/types/client.type';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let mockRepo: jest.Mocked<ClientRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCedula: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CreateClientUseCase(mockRepo);
  });

  it('should throw ConflictException if client already exists', async () => {
    mockRepo.findByCedula.mockResolvedValueOnce({ id: '1', cedula: '1723439319' } as ClientEntity);

    await expect(
      useCase.execute({
        cedula: '1723439319',
        nombres: 'Test',
        apellidos: 'User',
        telefono: '0999999999',
        correo: 'test@email.com',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create client successfully when cedula is unique', async () => {
    mockRepo.findByCedula.mockResolvedValueOnce(null);
    const mockCreated = { id: 'uuid-1', cedula: '1723439319', nombres: 'Test' } as ClientEntity;
    mockRepo.create.mockResolvedValueOnce(mockCreated);

    const result = await useCase.execute({
      cedula: '1723439319',
      nombres: 'Test',
      apellidos: 'User',
      telefono: '0999999999',
      correo: 'test@email.com',
    });

    expect(result).toEqual(mockCreated);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});

