import { Module } from '@nestjs/common';
import { ProductsController } from './api/controllers/products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { FindProductByIdUseCase } from './application/use-cases/find-product-by-id.use-case';
import { FindProductsUseCase } from './application/use-cases/find-products.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { PRODUCT_REPOSITORY_PORT } from './domain/interfaces/product-repository.port';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    FindProductsUseCase,
    FindProductByIdUseCase,
    UpdateProductUseCase,
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY_PORT, FindProductByIdUseCase],
})
export class ProductsModule {}

