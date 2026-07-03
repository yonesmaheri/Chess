import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CsrfGuard } from './guards/csrf.guard';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, CsrfGuard],
  exports: [AuthService, AuthGuard, JwtModule, UsersModule],
})
export class AuthModule {}
