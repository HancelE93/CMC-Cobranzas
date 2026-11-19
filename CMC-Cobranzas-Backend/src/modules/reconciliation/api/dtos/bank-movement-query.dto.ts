import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class BankMovementQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por banco o entidad financiera' })
  @IsOptional()
  @IsString()
  banco?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado: sin_asignar o conciliado' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Fecha inicio de consulta' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaDesde?: Date;

  @ApiPropertyOptional({ description: 'Fecha fin de consulta' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaHasta?: Date;
}

