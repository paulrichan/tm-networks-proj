"use client"

import PlayerList from "@/components/player-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import usePlayers from "@/hooks/use-players";
import { teamLookup } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams()
    const { data, isLoading } = usePlayers()

    if (isLoading || !data) {
        return <p>Loading...</p>
    }

    const teamData = data.playersWithTeams[params.teamId as string]

    return (
        <div className="space-y-2 w-full max-w-[1100px]">
            <div className="flex items-center space-x-2">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={teamData?.teamImage} alt={teamLookup[params.teamId as string].name} />
                    <AvatarFallback>{teamLookup[params.teamId as string].name[0]}</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">
                    {teamLookup[params.teamId as string].name}
                </h2>
                <span className="italic text-muted-foreground">
                    (2023)
                </span>
            </div>

            <PlayerList players={teamData.players} />
        </div>
    );
}