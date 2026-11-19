import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@cmc.com', description: 'Nombre de usuario o correo electrónico' })
  @IsString()
  @IsNotEmpty({ message: 'El identificador de usuario es obligatorio' })
  usernameOrEmail!: string;

  @ApiProperty({ example: 'Admin123*', description: 'Contraseña del usuario' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}

