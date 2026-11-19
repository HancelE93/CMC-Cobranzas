import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from '../../../../common/interfaces/auth-payload.interface';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../../domain/interfaces/user-repository.port';
import { TokenIssuerService } from '../services/token-issuer.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Token de refresco ausente');
    }

    let payload: AuthPayload;
    try {
      payload = this.jwtService.verify<AuthPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    if (payload.typ !== 'refresh') {
      throw new UnauthorizedException('Tipo de token no válido');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user || user.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    return this.tokenIssuer.issue({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.rol,
    });
  }
}

