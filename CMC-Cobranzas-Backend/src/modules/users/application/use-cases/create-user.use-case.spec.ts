import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.use-case';
import { UserAdminRepositoryPort } from '../../domain/interfaces/user-admin-repository.port';
import { UserAdminEntity } from '../../domain/types/user-admin.type';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepo: jest.Mocked<UserAdminRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUsernameOrEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CreateUserUseCase(mockRepo);
  });

  it('should throw ConflictException if username already exists', async () => {
    mockRepo.findByUsernameOrEmail.mockResolvedValueOnce({
      id: 'u1',
      username: 'carlos',
    } as UserAdminEntity);

    await expect(
      useCase.execute({
        username: 'carlos',
        email: 'carlos@email.com',
        password: 'password123',
        nombre: 'Carlos',
        cargo: 'Supervisor',
        rol: 'SUPERVISOR',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if email already exists', async () => {
    mockRepo.findByUsernameOrEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'u1', email: 'carlos@email.com' } as UserAdminEntity);

    await expect(
      useCase.execute({
        username: 'carlos',
        email: 'carlos@email.com',
        password: 'password123',
        nombre: 'Carlos',
        cargo: 'Supervisor',
        rol: 'SUPERVISOR',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create user successfully when username and email are unique', async () => {
    mockRepo.findByUsernameOrEmail.mockResolvedValue(null);
    const mockCreated: UserAdminEntity = {
      id: 'u-1',
      username: 'carlos',
      email: 'carlos@email.com',
      nombre: 'Carlos Mendoza',
      cargo: 'Supervisor',
      rol: 'SUPERVISOR',
      estado: 'ACTIVO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepo.create.mockResolvedValueOnce(mockCreated);

    const result = await useCase.execute({
      username: 'carlos',
      email: 'carlos@email.com',
      password: 'password123',
      nombre: 'Carlos Mendoza',
      cargo: 'Supervisor',
      rol: 'SUPERVISOR',
    });

    expect(result).toEqual(mockCreated);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });
});

