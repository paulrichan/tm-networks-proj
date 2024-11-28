"use client"

import { teamLookup } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import usePlayers from "@/hooks/use-players";
import { buttonVariants } from "./ui/button";
import { useParams, usePathname } from "next/navigation";

export default function TeamSelector() {
    const params = useParams()
    const pathname = usePathname()
    const { data, isLoading } = usePlayers()

    if (isLoading || !data) {
        return <p>Loading...</p>
    }

    const playersWithTeams = data?.playersWithTeams

    return (
        <div>
            <h2 className="font-semibold">Teams</h2>
            <small className="text-xs font-semibold text-muted-foreground italic">Eligible Batting Titles</small>

            <ul>
                <Link
                    href={`/`}
                    className={`${buttonVariants({
                        variant: pathname === '/' ? 'secondary' : 'ghost'
                    })} flex gap-2 py-3 px-2 w-full justify-start italic font-semibold`}
                >
                    All Players
                </Link>
                {Object.entries(playersWithTeams).map(([teamId, team]) => {
                    const isOnTeamPage = params.teamId === teamId

                    return (
                        <Link
                            href={`/${teamId}`}
                            key={teamId}
                            className={`${buttonVariants({
                                variant: isOnTeamPage ? 'secondary' : 'ghost'
                            })} flex gap-2 py-3 px-2 w-full justify-start`}
                        >
                            <Image src={team.teamImage} alt={teamId} className="w-6 h-6" width={50} height={50} />
                            <span className="">{teamLookup[teamId].name}</span>
                        </Link>
                    )
                })}
            </ul>
        </div>
    );
}