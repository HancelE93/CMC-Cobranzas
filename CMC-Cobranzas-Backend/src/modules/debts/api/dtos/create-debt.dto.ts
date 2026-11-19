import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del cliente' })
  @IsUUID('4', { message: 'El clienteId debe ser un UUID v4 válido' })
  @IsNotEmpty({ message: 'El clienteId es obligatorio' })
  clienteId!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'ID del producto' })
  @IsUUID('4', { message: 'El productoId debe ser un UUID v4 válido' })
  @IsNotEmpty({ message: 'El productoId es obligatorio' })
  productoId!: string;

  @ApiProperty({ example: 400.0, description: 'Precio final acordado para la deuda' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio acordado debe tener máximo 2 decimales' })
  @IsPositive({ message: 'El precio acordado debe ser mayor a 0' })
  precioAcordado!: number;

  @ApiPropertyOptional({ example: 450.0, description: 'Precio nominal del producto' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  precioNominalAplicado?: number;

  @ApiProperty({ example: '2026-11-01T00:00:00.000Z', description: 'Fecha de adquisición' })
  @IsDateString({}, { message: 'La fecha de adquisición debe ser una fecha ISO8601 válida' })
  @IsNotEmpty({ message: 'La fecha de adquisición es requerida' })
  fechaAdquisicion!: string;

  @ApiPropertyOptional({ example: 'TRANSFERENCIA', description: 'Método de pago preferente' })
  @IsString()
  @IsOptional()
  metodoPago?: string;

  @ApiPropertyOptional({ example: 6, description: 'Plazo en meses' })
  @Type(() => Number)
  @IsInt({ message: 'El plazo en meses debe ser un número entero' })
  @Min(1)
  @Max(60)
  @IsOptional()
  plazoMeses?: number;

  @ApiPropertyOptional({ example: 15, description: 'Día de corte mensual (1-31)' })
  @Type(() => Number)
  @IsInt({ message: 'El día de corte debe ser un número entero' })
  @Min(1)
  @Max(31)
  @IsOptional()
  diaCorte?: number;

  @ApiPropertyOptional({ example: 'Adquisición con descuento promocional' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}

