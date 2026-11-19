import { ProductEntity, ProductStatus } from '../types/product.type';

export interface FindProductsParams {
  search?: string;
  estado?: ProductStatus;
  skip?: number;
  take?: number;
}

export interface ProductRepositoryPort {
  create(data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findAll(params?: FindProductsParams): Promise<{ items: ProductEntity[]; total: number }>;
  update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity>;
}

export const PRODUCT_REPOSITORY_PORT = Symbol('ProductRepositoryPort');

