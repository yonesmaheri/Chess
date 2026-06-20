import { apiClient } from "@/shared/api";
import { buildCsrfHeaders } from "./config";
import type { AuthResponse, LoginPayload, RegisterPayload } from "./types";

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  async logout() {
    const { data } = await apiClient.post<{ success: boolean }>(
      "/auth/logout",
      undefined,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async refresh() {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/refresh",
      undefined,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async me() {
    const { data } = await apiClient.get<AuthResponse>("/auth/me");

    return data;
  },
};
