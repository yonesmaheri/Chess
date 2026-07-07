import type { GameRoomSettings } from "../lib/useSessionGameRoom";

export type {
  GameRoomChatMessage,
  GameRoomMovePair,
  GameRoomPlayerStatus,
  GameRoomSettings,
} from "../lib/useSessionGameRoom";

export type MatchSessionGameRoomProps = {
  sessionId: string;
  opponentName: string;
  playerColor?: "w" | "b";
};

export type GameRoomRequestType = "draw" | "undo";

export type GameRoomSettingKey = keyof GameRoomSettings;
