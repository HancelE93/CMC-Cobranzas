import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class InvoiceQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por cliente' })
  @IsOptional()
  @IsUUID()
  clienteId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por deuda' })
  @IsOptional()
  @IsUUID()
  deudaId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado documental' })
  @IsOptional()
  @IsString()
  estadoDocumental?: string;

  @ApiPropertyOptional({ description: 'Fecha inicio de emision' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaDesde?: Date;

  @ApiPropertyOptional({ description: 'Fecha fin de emision' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaHasta?: Date;
}

