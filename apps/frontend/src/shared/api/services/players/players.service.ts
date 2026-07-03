import { apiClient } from "@/shared/api";
import type { PlayerProfile } from "./types";

export const playersService = {
  async getByUsername(username: string) {
    const { data } = await apiClient.get<PlayerProfile>(
      `/leaderboard/players/${encodeURIComponent(username)}`,
    );

    return data;
  },
};
