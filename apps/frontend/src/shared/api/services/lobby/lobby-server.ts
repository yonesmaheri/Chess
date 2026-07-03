import { cookies } from "next/headers";
import type { GetLobbyResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

type LobbyErrorPayload = {
  message?: string;
};

export class LobbyServerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "LobbyServerError";
  }
}

async function buildLobbyError(response: Response, fallbackMessage: string) {
  let message = fallbackMessage;

  try {
    const data = (await response.json()) as LobbyErrorPayload;
    if (data.message) {
      message = data.message;
    }
  } catch {
    // Ignore invalid JSON error bodies and use the fallback message.
  }

  return new LobbyServerError(message, response.status);
}

export async function getServerLobby(): Promise<GetLobbyResponse> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(`${API_BASE_URL}/lobby`, {
    headers: {
      accept: "application/json",
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw await buildLobbyError(
      response,
      "بارگذاری اطلاعات اتاق بازی با مشکل روبه‌رو شد.",
    );
  }

  return (await response.json()) as GetLobbyResponse;
}
