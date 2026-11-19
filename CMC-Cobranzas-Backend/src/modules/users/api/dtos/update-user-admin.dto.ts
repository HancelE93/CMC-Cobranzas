import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../../domain/types/user-admin.type';

export class UpdateUserAdminDto {
  @ApiPropertyOptional({ example: 'Carlos Mendoza Ramos' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'carlos.mendoza@clearminds.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'NuevaClave2026*' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'Jefe de Operaciones' })
  @IsString()
  @IsOptional()
  cargo?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR'] })
  @IsEnum(['ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR'])
  @IsOptional()
  rol?: UserRole;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO'] })
  @IsEnum(['ACTIVO', 'INACTIVO'])
  @IsOptional()
  estado?: UserStatus;

  @ApiPropertyOptional({ example: { clientes: { ver: true, crear: true, modificar: true } } })
  @IsObject()
  @IsOptional()
  permisos?: Record<string, any>;
}

