import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingQueueService } from './matchmaking-queue.service';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [JwtModule, UsersModule, SharedModule],
  providers: [MatchmakingGateway, MatchmakingQueueService],
  exports: [MatchmakingQueueService],
})
export class MatchmakingModule {}
