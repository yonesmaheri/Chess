import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';
import type { User } from '../generated/prisma/client';
import { UsersService } from '../users/users.service';
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_MS,
  ACCESS_TOKEN_TTL,
  CSRF_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE_MS,
  REFRESH_TOKEN_TTL,
} from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type JwtPayload = {
  sub: string;
  phone: string;
  tokenVersion: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    const existingUser = await this.usersService.findByPhone(registerDto.phone);

    if (existingUser) {
      throw new ConflictException('کاربری با این شماره تلفن از قبل وجود دارد.');
    }

    const passwordHash = await hash(
      registerDto.password,
      this.getSaltRounds(),
    );
    const user = await this.usersService.createUser({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      passwordHash,
    });

    await this.issueSession(user, response);

    return {
      user: this.usersService.toAuthenticatedUser(user),
    };
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.usersService.findByPhone(loginDto.phone);

    if (!user) {
      throw new UnauthorizedException('شماره تلفن یا رمز عبور اشتباه است.');
    }

    const passwordMatches = await compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('شماره تلفن یا رمز عبور اشتباه است.');
    }

    await this.issueSession(user, response);

    return {
      user: this.usersService.toAuthenticatedUser(user),
    };
  }

  async refresh(request: Request, response: Response) {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findByIdOrThrow(payload.sub);

    if (user.refreshTokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token is not active.');
    }

    const refreshTokenMatches = await compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    await this.issueSession(user, response);

    return {
      user: this.usersService.toAuthenticatedUser(user),
    };
  }

  async logout(request: Request, response: Response) {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];

    if (typeof refreshToken === 'string') {
      try {
        const payload = await this.verifyRefreshToken(refreshToken);
        await this.usersService.clearRefreshToken(payload.sub);
      } catch {
        // Always clear cookies even if the stored refresh token is stale.
      }
    }

    this.clearSessionCookies(response);

    return {
      success: true,
    };
  }

  clearSessionCookies(response: Response) {
    const cookieOptions = this.getBaseCookieOptions();

    response.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions);
    response.clearCookie(REFRESH_TOKEN_COOKIE, cookieOptions);
    response.clearCookie(CSRF_TOKEN_COOKIE, {
      ...cookieOptions,
      httpOnly: false,
    });
  }

  private async issueSession(user: User, response: Response) {
    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      tokenVersion: user.refreshTokenVersion,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'AUTH_ACCESS_TOKEN_SECRET',
        ),
        expiresIn: ACCESS_TOKEN_TTL,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          'AUTH_REFRESH_TOKEN_SECRET',
        ),
        expiresIn: REFRESH_TOKEN_TTL,
      }),
    ]);
    const refreshTokenHash = await hash(refreshToken, this.getSaltRounds());
    const csrfToken = randomBytes(32).toString('hex');

    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...this.getBaseCookieOptions(),
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
      httpOnly: true,
    });
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...this.getBaseCookieOptions(),
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      httpOnly: true,
    });
    response.cookie(CSRF_TOKEN_COOKIE, csrfToken, {
      ...this.getBaseCookieOptions(),
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      httpOnly: false,
    });
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>(
          'AUTH_REFRESH_TOKEN_SECRET',
        ),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  private getBaseCookieOptions() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const domain = this.configService.get<string>('AUTH_COOKIE_DOMAIN');

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('strict' as const) : ('lax' as const),
      path: '/',
      domain: domain || undefined,
    };
  }

  private getSaltRounds(): number {
    return Number(this.configService.get('BCRYPT_SALT_ROUNDS') ?? 12);
  }
}
