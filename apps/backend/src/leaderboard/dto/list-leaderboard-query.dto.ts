import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { LeaderboardMode } from '../../generated/prisma/client';
import { LEADERBOARD_PAGE_SIZE } from '../leaderboard.constants';

export class ListLeaderboardQueryDto {
  @IsOptional()
  @IsEnum(LeaderboardMode)
  mode?: LeaderboardMode = LeaderboardMode.blitz;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  limit?: number = LEADERBOARD_PAGE_SIZE;
}
