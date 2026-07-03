import { apiClient } from "@/shared/api";
import { buildCsrfHeaders } from "@/shared/api/services/auth";
import type {
  CreateAiMatchPayload,
  CreateAiMatchResponse,
} from "./types";

export const matchmakingService = {
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
