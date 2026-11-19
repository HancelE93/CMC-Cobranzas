import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IssuedTokens, TokenSubject } from '../../../../common/interfaces/auth-payload.interface';
import { durationToMs } from '../../../../common/utils/duration.util';

@Injectable()
export class TokenIssuerService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  issue(subject: TokenSubject): IssuedTokens {
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    return {
      accessToken: this.jwtService.sign({ ...subject, typ: 'access' }),
      refreshToken: this.jwtService.sign(
        { ...subject, typ: 'refresh' },
        { expiresIn: refreshExpiresIn as any },
      ),
      refreshMaxAgeMs: durationToMs(refreshExpiresIn),
    };
  }
}

