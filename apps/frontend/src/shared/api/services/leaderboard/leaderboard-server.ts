import type {
  GetLeaderboardParams,
  GetLeaderboardResponse,
  LeaderboardMode,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

type LeaderboardErrorPayload = {
  message?: string;
};

export class LeaderboardServerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "LeaderboardServerError";
  }
}

function appendParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === "") {
    return;
  }

  searchParams.set(key, String(value));
}

function buildLeaderboardQuery(params: GetLeaderboardParams = {}) {
  const searchParams = new URLSearchParams();

  appendParam(searchParams, "mode", params.mode === "blitz" ? undefined : params.mode);
  appendParam(searchParams, "page", params.page);
  appendParam(searchParams, "limit", params.limit);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function buildLeaderboardError(
  response: Response,
  fallbackMessage: string,
) {
  let message = fallbackMessage;

  try {
    const data = (await response.json()) as LeaderboardErrorPayload;
    if (data.message) {
      message = data.message;
    }
  } catch {
    // Ignore invalid JSON error bodies and use the fallback message.
  }

  return new LeaderboardServerError(message, response.status);
}

export async function getServerLeaderboard(
  params: GetLeaderboardParams = {},
): Promise<GetLeaderboardResponse> {
  const response = await fetch(
    `${API_BASE_URL}/leaderboard${buildLeaderboardQuery(params)}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw await buildLeaderboardError(
      response,
      "بارگذاری جدول رده‌بندی با مشکل روبه‌رو شد.",
    );
  }

  return (await response.json()) as GetLeaderboardResponse;
}

export type { LeaderboardMode };
