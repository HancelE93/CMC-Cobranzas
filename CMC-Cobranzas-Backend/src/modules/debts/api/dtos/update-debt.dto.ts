import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DebtStatus } from '../../domain/types/debt.type';

export class UpdateDebtDto {
  @ApiPropertyOptional({ enum: ['PENDIENTE', 'PARCIAL', 'PAGADA', 'ANULADA'] })
  @IsEnum(['PENDIENTE', 'PARCIAL', 'PAGADA', 'ANULADA'])
  @IsOptional()
  estado?: DebtStatus;

  @ApiPropertyOptional({ example: 'TRANSFERENCIA' })
  @IsString()
  @IsOptional()
  metodoPago?: string;

  @ApiPropertyOptional({ example: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  @IsOptional()
  diaCorte?: number;

  @ApiPropertyOptional({ example: 'Observación actualizada' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}

