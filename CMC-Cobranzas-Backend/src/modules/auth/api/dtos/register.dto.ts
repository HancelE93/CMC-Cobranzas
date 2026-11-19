import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'juan.perez', description: 'Nombre de usuario único' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username!: string;

  @ApiProperty({ example: 'juan.perez@cmc.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email!: string;

  @ApiProperty({ example: 'Password123*', description: 'Contraseña' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombres y apellidos completos' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombre!: string;

  @ApiProperty({ example: 'Gestor de Cobranzas', description: 'Cargo o puesto del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El cargo es obligatorio' })
  cargo!: string;

  @ApiPropertyOptional({ example: 'COBRADOR', description: 'Rol asignado' })
  @IsString()
  @IsOptional()
  rol?: string;
}

