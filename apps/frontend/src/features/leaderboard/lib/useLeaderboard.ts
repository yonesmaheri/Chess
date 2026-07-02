import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  leaderboardService,
  type GetLeaderboardResponse,
  type LeaderboardMode,
} from "@/shared/api/services/leaderboard";
import { LEADERBOARD_PAGE_SIZE } from "./constants";

type UseLeaderboardParams = {
  mode: LeaderboardMode;
  page: number;
};

export function useLeaderboard({ mode, page }: UseLeaderboardParams) {
  return useQuery<GetLeaderboardResponse>({
    queryKey: ["leaderboard", mode, page],
    queryFn: () =>
      leaderboardService.get({
        mode,
        page,
        limit: LEADERBOARD_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });
}
