import { Controller, Get, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { ListLeaderboardQueryDto } from './dto/list-leaderboard-query.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  findAll(@Query() query: ListLeaderboardQueryDto) {
    return this.leaderboardService.findAll(query);
  }
}
