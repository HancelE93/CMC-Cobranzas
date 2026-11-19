import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClientStatus } from '../../domain/types/client.type';

export class CreateClientDto {
  @ApiProperty({ example: '1723439319', description: 'Cédula o documento de identidad' })
  @IsString()
  @IsNotEmpty({ message: 'La cédula es requerida' })
  cedula!: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  nombres!: string;

  @ApiProperty({ example: 'Pérez Gómez', description: 'Apellidos del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  apellidos!: string;

  @ApiProperty({ example: '0987654321', description: 'Teléfono de contacto' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  telefono!: string;

  @ApiProperty({ example: 'juan.perez@email.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo!: string;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  @IsEnum(['ACTIVO', 'INACTIVO'], { message: 'Estado debe ser ACTIVO o INACTIVO' })
  @IsOptional()
  estado?: ClientStatus;

  @ApiPropertyOptional({ example: 'Cliente preferencial', description: 'Notas adicionales' })
  @IsString()
  @IsOptional()
  notas?: string;
}

