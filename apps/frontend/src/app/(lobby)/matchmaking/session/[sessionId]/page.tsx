import { MatchSessionGameRoom } from "@/features/gameRoom";

type MatchSessionPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams: Promise<{
    opponent?: string;
    color?: "w" | "b";
  }>;
};

export const metadata = {
  title: "اتاق بازی",
  description: "ورود به اتاق بازی پس از یافتن حریف در matchmaking.",
};

export default async function MatchSessionPage({
  params,
  searchParams,
}: MatchSessionPageProps) {
  const { sessionId } = await params;
  const { opponent, color } = await searchParams;

  return (
    <MatchSessionGameRoom
      sessionId={sessionId}
      opponentName={opponent ?? "حریف شما"}
      playerColor={color === "b" ? "b" : "w"}
    />
  );
}
