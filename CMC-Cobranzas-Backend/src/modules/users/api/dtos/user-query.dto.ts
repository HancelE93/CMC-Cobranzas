import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UserRole, UserStatus } from '../../domain/types/user-admin.type';

export class UserQueryDto {
  @ApiPropertyOptional({ description: 'Buscar por username, email o nombre' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR'] })
  @IsEnum(['ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR'])
  @IsOptional()
  rol?: UserRole;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO'] })
  @IsEnum(['ACTIVO', 'INACTIVO'])
  @IsOptional()
  estado?: UserStatus;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}

