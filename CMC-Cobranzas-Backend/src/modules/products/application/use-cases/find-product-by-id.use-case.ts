import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../domain/interfaces/product-repository.port';
import { ProductEntity } from '../../domain/types/product.type';

@Injectable()
export class FindProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<ProductEntity> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }
}

