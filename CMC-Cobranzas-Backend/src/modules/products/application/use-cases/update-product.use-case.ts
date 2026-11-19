import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from '../../api/dtos/update-product.dto';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../domain/interfaces/product-repository.port';
import { ProductEntity } from '../../domain/types/product.type';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return this.productRepo.update(id, dto);
  }
}

