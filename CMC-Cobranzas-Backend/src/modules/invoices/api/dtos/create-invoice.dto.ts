import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID del cliente receptor' })
  @IsUUID()
  @IsNotEmpty()
  clienteId!: string;

  @ApiPropertyOptional({ description: 'ID de la deuda asociada' })
  @IsOptional()
  @IsUUID()
  deudaId?: string;

  @ApiProperty({
    description: 'Numero oficial de factura electronica',
    example: '001-001-000045123',
  })
  @IsString()
  @IsNotEmpty()
  numeroFactura!: string;

  @ApiProperty({
    description: 'Fecha de emision de la factura',
    example: '2026-11-06T10:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  fechaFactura!: Date;

  @ApiProperty({ description: 'Monto total facturado', example: 450.0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto!: number;

  @ApiPropertyOptional({
    description: 'Estado documental',
    default: 'pendiente_registrar',
  })
  @IsOptional()
  @IsString()
  estadoDocumental?: string;

  @ApiPropertyOptional({ description: 'Observaciones de facturacion' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

