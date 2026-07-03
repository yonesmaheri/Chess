import type { LobbyInvite } from "@/shared/api/services/lobby";

export type GetInvitesResponse = {
  activeInvite: LobbyInvite | null;
  recentChallenges: LobbyInvite[];
  incomingInvitations: LobbyInvite[];
};

export type CreateInviteResponse = {
  invite: LobbyInvite;
  reused: boolean;
};

export type ResolveInvitePayload = {
  token: string;
};

export type ResolveInviteResponse = {
  invite: LobbyInvite;
  game?: {
    sessionId: string;
    type: "private";
    status: "ready";
    fen: string;
    pgn: string;
    turn: "w" | "b";
    opponent: {
      name: string;
    };
  };
};
