import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { UsersService } from '../../users/users.service';
import { ACCESS_TOKEN_COOKIE } from '../constants/auth.constants';

type AccessTokenPayload = {
  sub: string;
  phone: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies?.[ACCESS_TOKEN_COOKIE];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Authentication required.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        {
          secret: this.configService.getOrThrow<string>(
            'AUTH_ACCESS_TOKEN_SECRET',
          ),
        },
      );
      const user = await this.usersService.findByIdOrThrow(payload.sub);

      request.user = this.usersService.toAuthenticatedUser(user);

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }
}
