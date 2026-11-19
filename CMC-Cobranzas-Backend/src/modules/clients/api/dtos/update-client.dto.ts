import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ClientStatus } from '../../domain/types/client.type';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'Juan Carlos' })
  @IsString()
  @IsOptional()
  nombres?: string;

  @ApiPropertyOptional({ example: 'Pérez Gómez' })
  @IsString()
  @IsOptional()
  apellidos?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({ example: 'juan.perez@email.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsOptional()
  correo?: string;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO'] })
  @IsEnum(['ACTIVO', 'INACTIVO'])
  @IsOptional()
  estado?: ClientStatus;

  @ApiPropertyOptional({ example: 'Notas actualizadas' })
  @IsString()
  @IsOptional()
  notas?: string;
}

