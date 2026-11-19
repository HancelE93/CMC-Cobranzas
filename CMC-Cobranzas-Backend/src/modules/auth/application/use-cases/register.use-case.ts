import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { HASHER_PORT, HasherPort } from '../../domain/interfaces/hasher.port';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../../domain/interfaces/user-repository.port';
import { TokenIssuerService } from '../services/token-issuer.service';
import { RegisterDto } from '../../api/dtos/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(HASHER_PORT)
    private readonly hasher: HasherPort,
    private readonly tokenIssuer: TokenIssuerService,
  ) {}

  async execute(dto: RegisterDto) {
    const existing = await this.userRepository.findByUsernameOrEmail(dto.username);
    if (existing) {
      throw new ConflictException('El nombre de usuario o correo ya se encuentra registrado');
    }

    const passwordHash = await this.hasher.hash(dto.password);

    const newUser = await this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      nombre: dto.nombre,
      cargo: dto.cargo,
      rol: dto.rol,
    });

    const tokens = this.tokenIssuer.issue({
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.rol,
    });

    return {
      tokens,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        nombre: newUser.nombre,
        cargo: newUser.cargo,
        rol: newUser.rol,
      },
    };
  }
}

