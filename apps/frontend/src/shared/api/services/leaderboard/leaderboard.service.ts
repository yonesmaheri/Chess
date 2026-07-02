import { apiClient } from "@/shared/api";
import type { GetLeaderboardParams, GetLeaderboardResponse } from "./types";

export const leaderboardService = {
  async get(params: GetLeaderboardParams = {}) {
    const { data } = await apiClient.get<GetLeaderboardResponse>("/leaderboard", {
      params,
    });

    return data;
  },
};
