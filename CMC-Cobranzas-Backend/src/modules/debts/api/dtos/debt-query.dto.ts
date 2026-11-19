import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { DebtStatus } from '../../domain/types/debt.type';

export class DebtQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de cliente' })
  @IsUUID('4')
  @IsOptional()
  clienteId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de producto' })
  @IsUUID('4')
  @IsOptional()
  productoId?: string;

  @ApiPropertyOptional({ enum: ['PENDIENTE', 'PARCIAL', 'PAGADA', 'ANULADA'] })
  @IsEnum(['PENDIENTE', 'PARCIAL', 'PAGADA', 'ANULADA'])
  @IsOptional()
  estado?: DebtStatus;

  @ApiPropertyOptional({ description: 'Buscar por cédula o nombre de cliente' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}

