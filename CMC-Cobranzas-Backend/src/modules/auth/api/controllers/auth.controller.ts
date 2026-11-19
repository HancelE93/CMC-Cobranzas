import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { Public } from '../../../../common/decorators/public.decorator';
import { AuthPayload, IssuedTokens } from '../../../../common/interfaces/auth-payload.interface';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con credenciales' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.loginUseCase.execute(dto);
    this.setRefreshTokenCookie(response, result.tokens);
    return {
      accessToken: result.tokens.accessToken,
      user: result.user,
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.registerUseCase.execute(dto);
    this.setRefreshTokenCookie(response, result.tokens);
    return {
      accessToken: result.tokens.accessToken,
      user: result.user,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar tokens mediante cookie httpOnly' })
  @ApiResponse({ status: 200, description: 'Tokens refrescados exitosamente' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refreshToken;
    const tokens = await this.refreshTokenUseCase.execute(refreshToken);
    this.setRefreshTokenCookie(response, tokens);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión e invalidar cookie de refresco' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      path: this.configService.get<string>('COOKIE_PATH') || '/',
    });
    return { message: 'Sesión finalizada correctamente' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado actual' })
  getProfile(@CurrentUser() user: AuthPayload) {
    return user;
  }

  private setRefreshTokenCookie(response: Response, tokens: IssuedTokens) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const sameSite =
      (this.configService.get<'lax' | 'strict' | 'none'>('COOKIE_SAMESITE')) || 'lax';
    const path = this.configService.get<string>('COOKIE_PATH') || '/';
    const persistent = this.configService.get<string>('COOKIE_PERSISTENT') === 'true';

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite,
      path,
      ...(persistent ? { maxAge: tokens.refreshMaxAgeMs } : {}),
    });
  }
}

