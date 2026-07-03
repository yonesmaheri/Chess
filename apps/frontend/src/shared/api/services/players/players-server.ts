import type { PlayerProfile } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

type PlayerErrorPayload = {
  message?: string;
};

export class PlayerProfileServerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "PlayerProfileServerError";
  }
}

async function buildPlayerError(response: Response, fallbackMessage: string) {
  let message = fallbackMessage;

  try {
    const data = (await response.json()) as PlayerErrorPayload;
    if (data.message) {
      message = data.message;
    }
  } catch {
    // Ignore invalid JSON error bodies and keep fallback message.
  }

  return new PlayerProfileServerError(message, response.status);
}

export async function getServerPlayerProfile(
  username: string,
): Promise<PlayerProfile> {
  const response = await fetch(
    `${API_BASE_URL}/leaderboard/players/${encodeURIComponent(username)}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw await buildPlayerError(
      response,
      "بارگذاری پروفایل بازیکن با مشکل روبه رو شد.",
    );
  }

  return (await response.json()) as PlayerProfile;
}
