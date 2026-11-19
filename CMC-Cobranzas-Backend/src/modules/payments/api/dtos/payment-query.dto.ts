import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { PaymentMethod, PaymentRegisterStatus } from '../../domain/types/payment.type';

export class PaymentQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID de cliente' })
  @IsOptional()
  @IsString()
  clienteId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de deuda' })
  @IsOptional()
  @IsString()
  deudaId?: string;

  @ApiPropertyOptional({ enum: ['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'DEPOSITO', 'OTRO'] })
  @IsOptional()
  @IsEnum(['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'DEPOSITO', 'OTRO'])
  metodo?: PaymentMethod;

  @ApiPropertyOptional({ enum: ['REGISTRADO', 'PENDIENTE_REVISION', 'ANULADO'] })
  @IsOptional()
  @IsEnum(['REGISTRADO', 'PENDIENTE_REVISION', 'ANULADO'])
  estadoRegistro?: PaymentRegisterStatus;

  @ApiPropertyOptional({ description: 'Fecha de pago inicio' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaDesde?: Date;

  @ApiPropertyOptional({ description: 'Fecha de pago fin' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaHasta?: Date;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  take?: number;
}

