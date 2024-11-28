import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { teamLookup } from "@/lib/utils"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { useState } from "react"

export default function PlayerList({ players }: { players: Player[] }) {
    const [filterBy, setFilterBy] = useState('lastName')
    const [search, setSearch] = useState('')

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <Input placeholder="Search by player name..." onChange={(e) => setSearch(e.currentTarget.value)} />
                </div>
                <div className="flex flex-col justify-center items-center w-fit">
                    <small className="text-[10px] text-muted-foreground">Sort by</small>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="filterBy" className={`${filterBy === 'lastName' ? '' : 'text-muted-foreground'} w-full`}>Last Name</Label>
                        <Switch id="filterBy" onCheckedChange={(e) => setFilterBy(!e ? 'lastName' : 'firstName')} />
                        <Label htmlFor="filterBy" className={`${filterBy === 'firstName' ? '' : 'text-muted-foreground'} w-full whitespace-nowrap`}>First Name</Label>
                    </div>
                </div>
            </div>

            <ul className="grid grid-cols-4 gap-2">
                {players.filter(player => player.playerFullName.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
                    const firstName = a.playerFullName.split(' ')[0]
                    const lastName = a.playerFullName.split(' ')[1]
                    if (filterBy === 'firstName') {
                        return firstName.localeCompare(b.playerFullName.split(' ')[0])
                    }
                    return lastName.localeCompare(b.playerFullName.split(' ')[1])
                }).map((player) => {
                    const teamId = player.teamImage.slice(player.teamImage.lastIndexOf('/') + 1, player.teamImage.lastIndexOf('.'))
                    const playerInitials = player.playerFullName.split(' ').map((name) => name[0]).join('')
                    return (
                        <Link
                            key={player.playerId}
                            className={`${buttonVariants({
                                variant: 'secondary',
                                size: 'lg',
                                className: 'w-full flex flex-col h-full p-3 gap-1'
                            })}`}
                            href={`/${teamId}/${player.playerId}`}
                        >
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={player.playerImage} alt={player.playerFullName} />
                                <AvatarFallback>{playerInitials}</AvatarFallback>
                            </Avatar>
                            <p className="m-0">{player.playerFullName}</p>
                            <small className="text-muted-foreground">{teamLookup[teamId].name} <span className="italic">(2023)</span></small>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}