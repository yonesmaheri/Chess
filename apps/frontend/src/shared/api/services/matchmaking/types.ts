export type CreateRandomMatchResponse = {
  status: "searching";
  ticketId: string;
  estimatedWaitSeconds: number;
  queue: "random";
  player: {
    id: string;
    name: string;
  };
  note: string;
};

export type CreateAiMatchPayload = {
  difficulty: number;
};

export type CreateAiMatchResponse = {
  status: "ready";
  sessionId: string;
  type: "ai";
  difficulty: number;
  difficultyLabel: string;
  player: {
    id: string;
    name: string;
  };
  opponent: {
    name: string;
    title: string;
  };
  board: {
    fen: string;
    pgn: string;
    turn: "w" | "b";
  };
  note: string;
};

export type GetMatchStatusResponse =
  | {
      status: "searching";
      ticketId: string;
      estimatedWaitSeconds: number;
      queue: "random";
      player: {
        id: string;
        name: string;
      };
    }
  | {
      status: "matched";
      ticketId: string;
      sessionId: string;
      queue: "random";
      player: {
        id: string;
        name: string;
      };
      opponent: {
        id: string;
        name: string;
        rating?: number;
        country?: string;
      };
    }
  | {
      status: "failed";
      reason: string;
    };

export type CancelMatchmakingResponse = {
  success: boolean;
  message: string;
};
