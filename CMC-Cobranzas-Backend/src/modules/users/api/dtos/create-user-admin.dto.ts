import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../../domain/types/user-admin.type';

export class CreateUserAdminDto {
  @ApiProperty({ example: 'carlos.mendoza', description: 'Nombre de usuario único' })
  @IsString()
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username!: string;

  @ApiProperty({ example: 'carlos.mendoza@clearminds.com', description: 'Correo electrónico institucional' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email!: string;

  @ApiProperty({ example: 'ClaveSegura2026*', description: 'Contraseña de acceso' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;

  @ApiProperty({ example: 'Carlos Mendoza', description: 'Nombre y apellido completos' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombre!: string;

  @ApiProperty({ example: 'Supervisor de Cobranzas', description: 'Cargo o posición en la empresa' })
  @IsString()
  @IsNotEmpty({ message: 'El cargo es obligatorio' })
  cargo!: string;

  @ApiProperty({ enum: ['ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR'], default: 'COBRADOR' })
  @IsEnum(['ADMIN', 'SUPERVISOR', 'COBRADOR', 'AUDITOR'], { message: 'El rol debe ser ADMIN, SUPERVISOR, COBRADOR o AUDITOR' })
  rol!: UserRole;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  @IsEnum(['ACTIVO', 'INACTIVO'])
  @IsOptional()
  estado?: UserStatus;

  @ApiPropertyOptional({ description: 'Matriz granular de permisos por módulo', example: { clientes: { ver: true, crear: true } } })
  @IsObject()
  @IsOptional()
  permisos?: Record<string, any>;
}

