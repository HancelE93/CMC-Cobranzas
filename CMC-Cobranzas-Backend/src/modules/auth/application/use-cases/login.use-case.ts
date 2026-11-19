import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { HASHER_PORT, HasherPort } from '../../domain/interfaces/hasher.port';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../../domain/interfaces/user-repository.port';
import { TokenIssuerService } from '../services/token-issuer.service';
import { LoginDto } from '../../api/dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HASHER_PORT)
    private readonly hasher: HasherPort,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository.findByUsernameOrEmail(dto.usernameOrEmail);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario inactivo o bloqueado');
    }

    const isPasswordValid = await this.hasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = this.tokenIssuer.issue({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.rol,
    });

    return {
      tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        cargo: user.cargo,
        rol: user.rol,
      },
    };
  }
}

