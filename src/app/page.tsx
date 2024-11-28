"use client"

import PlayerList from "@/components/player-list";
import usePlayers from "@/hooks/use-players";

export default function Home() {
  const { data, isLoading } = usePlayers()

  if (isLoading || !data) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-2 max-w-[1100px] w-full md:p-2">
      <h2 className="font-semibold">All Players</h2>

      <PlayerList players={data.allPlayers} />
    </div>
  );
}
