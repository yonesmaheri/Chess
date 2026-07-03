import { apiClient } from "@/shared/api";
import { buildCsrfHeaders } from "@/shared/api/services/auth";
import type {
  CreateAiMatchPayload,
  CreateAiMatchResponse,
  CreateRandomMatchResponse,
} from "./types";

export const matchmakingService = {
  async createRandomMatch() {
    const { data } = await apiClient.post<CreateRandomMatchResponse>(
      "/matchmaking/random",
      undefined,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async createAiMatch(payload: CreateAiMatchPayload) {
    const { data } = await apiClient.post<CreateAiMatchResponse>(
      "/matchmaking/ai",
      payload,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },
};
