import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaymentMethod } from '../../domain/types/payment.type';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID de la deuda asociada' })
  @IsString()
  @IsNotEmpty()
  deudaId!: string;

  @ApiProperty({ description: 'ID del cliente' })
  @IsString()
  @IsNotEmpty()
  clienteId!: string;

  @ApiProperty({ description: 'Monto a pagar', example: 150.5 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto!: number;

  @ApiProperty({ description: 'Fecha en que se efectuó el pago', example: '2026-11-04T12:00:00Z' })
  @Type(() => Date)
  @IsDate()
  fechaPago!: Date;

  @ApiProperty({ enum: ['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'DEPOSITO', 'OTRO'], default: 'TRANSFERENCIA' })
  @IsEnum(['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'DEPOSITO', 'OTRO'])
  metodo!: PaymentMethod;

  @ApiPropertyOptional({ description: 'Banco de origen', example: 'Banco Pichincha' })
  @IsOptional()
  @IsString()
  bancoOrigen?: string;

  @ApiPropertyOptional({ description: 'Número de comprobante o transferencia', example: 'TRX-987654' })
  @IsOptional()
  @IsString()
  numeroTransaccion?: string;

  @ApiPropertyOptional({ description: 'Referencia adicional del pago' })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({ description: 'Observaciones del cobrador' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

