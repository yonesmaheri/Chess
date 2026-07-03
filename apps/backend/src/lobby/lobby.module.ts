import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CsrfGuard } from '../auth/guards/csrf.guard';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';

@Module({
  imports: [AuthModule],
  controllers: [LobbyController],
  providers: [LobbyService, CsrfGuard],
  exports: [LobbyService],
})
export class LobbyModule {}
