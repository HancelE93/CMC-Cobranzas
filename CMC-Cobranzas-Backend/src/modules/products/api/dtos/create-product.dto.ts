import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ProductStatus } from '../../domain/types/product.type';

export class CreateProductDto {
  @ApiProperty({ example: 'Curso de Inglés Avanzado', description: 'Nombre del producto o servicio' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  nombre!: string;

  @ApiProperty({ example: 'Programa de 6 meses con certificación', description: 'Descripción detallada' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion!: string;

  @ApiProperty({ example: 450.0, description: 'Precio nominal oficial del producto' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con hasta 2 decimales' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precioNominal!: number;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  @IsEnum(['ACTIVO', 'INACTIVO'], { message: 'El estado debe ser ACTIVO o INACTIVO' })
  @IsOptional()
  estado?: ProductStatus;
}

