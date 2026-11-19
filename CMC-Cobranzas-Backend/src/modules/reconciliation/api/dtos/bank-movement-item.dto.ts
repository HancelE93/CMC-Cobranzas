import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class BankMovementItemDto {
  @ApiProperty({ description: 'Fecha del movimiento bancario', example: '2026-11-06T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  fecha!: Date;

  @ApiProperty({ description: 'Monto de la transaccion', example: 120.0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto!: number;

  @ApiProperty({ description: 'Numero de comprobante o referencia bancaria', example: 'PICH-883102' })
  @IsString()
  @IsNotEmpty()
  numeroTransaccion!: string;

  @ApiPropertyOptional({ description: 'Referencia o descripcion del movimiento' })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({ description: 'Nombre o identificacion del ordenante' })
  @IsOptional()
  @IsString()
  ordenante?: string;
}

