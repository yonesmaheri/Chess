export type LobbyInviteStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired";

export type LobbyInviteParticipant = {
  id: string;
  fullName: string;
};

export type LobbyInvite = {
  id: string;
  status: LobbyInviteStatus;
  difficulty: number | null;
  createdAt: string;
  expiresAt: string;
  token: string;
  inviteUrl: string;
  creator: LobbyInviteParticipant;
  acceptedBy: LobbyInviteParticipant | null;
};

export type LobbyOnlineFriend = {
  id: string;
  fullName: string;
};

export type GetLobbyResponse = {
  hero: {
    title: string;
    subtitle: string;
  };
  online: {
    title: string;
    description: string;
  };
  ai: {
    title: string;
    description: string;
    levels: number[];
    recommendedDifficulty: number;
  };
  friends: {
    title: string;
    description: string;
    activeInvite: LobbyInvite | null;
    recentChallenges: LobbyInvite[];
    incomingInvitations: LobbyInvite[];
    supported: boolean;
    onlineFriends: LobbyOnlineFriend[];
    emptyStateMessage: string;
  };
  trustIndicators: string[];
  currentUser: {
    id: string;
    fullName: string;
  };
};
