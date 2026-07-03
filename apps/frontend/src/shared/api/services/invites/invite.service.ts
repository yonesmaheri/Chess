import { apiClient } from "@/shared/api";
import { buildCsrfHeaders } from "@/shared/api/services/auth";
import type {
  CreateInviteResponse,
  GetInvitesResponse,
  ResolveInvitePayload,
  ResolveInviteResponse,
} from "./types";

export const inviteService = {
  async get() {
    const { data } = await apiClient.get<GetInvitesResponse>("/invites");
    return data;
  },

  async create() {
    const { data } = await apiClient.post<CreateInviteResponse>(
      "/invite",
      undefined,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async accept(inviteId: string, payload: ResolveInvitePayload) {
    const { data } = await apiClient.post<ResolveInviteResponse>(
      `/invite/${inviteId}/accept`,
      payload,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },

  async reject(inviteId: string, payload: ResolveInvitePayload) {
    const { data } = await apiClient.post<ResolveInviteResponse>(
      `/invite/${inviteId}/reject`,
      payload,
      {
        headers: buildCsrfHeaders(),
      },
    );

    return data;
  },
};
