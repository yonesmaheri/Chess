import { LobbyPageFeature } from "@/features/lobby";
import { getServerLobby } from "@/shared/api/services/lobby";
import { getSingleQueryValue } from "@/features/lobby/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

type LobbyPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function LobbyPage({ searchParams }: LobbyPageProps) {
  const params = await searchParams;
  const data = await getServerLobby();

  return (
    <LobbyPageFeature
      initialData={data}
      inviteId={getSingleQueryValue(params.invite)}
      inviteToken={getSingleQueryValue(params.token)}
    />
  );
}
