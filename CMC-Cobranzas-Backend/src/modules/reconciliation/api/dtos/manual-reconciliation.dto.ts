import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ManualReconciliationDto {
  @ApiProperty({ description: 'ID del pago registrado a conciliar' })
  @IsUUID()
  @IsNotEmpty()
  pagoId!: string;

  @ApiProperty({ description: 'ID del movimiento bancario a vincular' })
  @IsUUID()
  @IsNotEmpty()
  movimientoBancarioId!: string;

  @ApiPropertyOptional({ description: 'Nota u observacion de la conciliacion' })
  @IsOptional()
  @IsString()
  observacion?: string;
}

