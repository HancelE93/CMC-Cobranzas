import { Inject, Injectable } from '@nestjs/common';
import { ProductQueryDto } from '../../api/dtos/product-query.dto';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../domain/interfaces/product-repository.port';

@Injectable()
export class FindProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.productRepo.findAll({
      search: query.search,
      estado: query.estado,
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}

