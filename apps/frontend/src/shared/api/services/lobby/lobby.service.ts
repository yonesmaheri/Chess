import { apiClient } from "@/shared/api";
import type { GetLobbyResponse } from "./types";

export const lobbyService = {
  async get() {
    const { data } = await apiClient.get<GetLobbyResponse>("/lobby");
    return data;
  },
};
