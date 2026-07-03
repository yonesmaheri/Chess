import PlayerProfileErrorState from "@/features/playerProfile/components/PlayerProfileErrorState";
import { PlayerProfileView } from "@/features/playerProfile";
import { getServerPlayerProfile } from "@/shared/api/services/players";

type PlayerProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PlayerProfilePage({
  params,
}: PlayerProfilePageProps) {
  const { username } = await params;

  try {
    const profile = await getServerPlayerProfile(username);

    return <PlayerProfileView profile={profile} />;
  } catch (error) {
    return <PlayerProfileErrorState error={error} />;
  }
}
