import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../../api/dtos/create-product.dto';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../domain/interfaces/product-repository.port';
import { ProductEntity } from '../../domain/types/product.type';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  execute(dto: CreateProductDto): Promise<ProductEntity> {
    return this.productRepo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precioNominal: dto.precioNominal,
      estado: dto.estado ?? 'ACTIVO',
    });
  }
}

