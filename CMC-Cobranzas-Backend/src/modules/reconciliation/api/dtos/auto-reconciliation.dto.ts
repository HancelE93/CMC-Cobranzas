import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AutoReconciliationDto {
  @ApiPropertyOptional({
    description: 'Banco o entidad especifica a conciliar automaticamente',
    example: 'Banco Pichincha',
  })
  @IsOptional()
  @IsString()
  banco?: string;
}

