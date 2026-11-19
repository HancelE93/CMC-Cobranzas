import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './api/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { TokenIssuerService } from './application/services/token-issuer.service';
import { HASHER_PORT } from './domain/interfaces/hasher.port';
import { USER_REPOSITORY_PORT } from './domain/interfaces/user-repository.port';
import { BcryptAdapter } from './infrastructure/adapters/bcrypt.adapter';
import { JwtStrategy } from './infrastructure/adapters/jwt.strategy';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '8h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    TokenIssuerService,
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    JwtStrategy,
    {
      provide: HASHER_PORT,
      useClass: BcryptAdapter,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: UserRepository,
    },
  ],
  exports: [JwtModule, TokenIssuerService],
})
export class AuthModule {}
