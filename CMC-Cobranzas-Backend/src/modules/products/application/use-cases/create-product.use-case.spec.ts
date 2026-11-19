import { CreateProductUseCase } from './create-product.use-case';
import { ProductRepositoryPort } from '../../domain/interfaces/product-repository.port';
import { ProductEntity } from '../../domain/types/product.type';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepo: jest.Mocked<ProductRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CreateProductUseCase(mockRepo);
  });

  it('should create product successfully', async () => {
    const mockCreated: ProductEntity = {
      id: 'uuid-prod-1',
      nombre: 'Curso de Inglés',
      descripcion: 'Nivel A1-B2',
      precioNominal: 350.0,
      estado: 'ACTIVO',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRepo.create.mockResolvedValueOnce(mockCreated);

    const result = await useCase.execute({
      nombre: 'Curso de Inglés',
      descripcion: 'Nivel A1-B2',
      precioNominal: 350.0,
    });

    expect(result).toEqual(mockCreated);
    expect(mockRepo.create).toHaveBeenCalledWith({
      nombre: 'Curso de Inglés',
      descripcion: 'Nivel A1-B2',
      precioNominal: 350.0,
      estado: 'ACTIVO',
    });
  });
});

