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
