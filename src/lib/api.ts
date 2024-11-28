'use server'

import { cookies } from "next/headers"

// Retrieve the tempToken from cookies
// Temp token should be refreshed automatically when it expires
async function getTempToken() {
    const cookiesStore = await cookies()
    const data = cookiesStore.get('tempToken')?.value

    if (!data) {
        throw new Error('No token found in cookies')
    }

    const tokenData: TokenData = JSON.parse(data)
    return tokenData.token
}

export async function mlbPlayers() {
    const token = await getTempToken()
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/mlb/players', {
        headers: {
            'tempToken': token
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch MLB players')
    }

    const allPlayers = await res.json() as Player[]
    const playersWithTeams = allPlayers.reduce((acc, player) => {
        const playerTeamId = player.teamImage.slice(player.teamImage.lastIndexOf('/') + 1, player.teamImage.lastIndexOf('.'))

        if (!acc[playerTeamId]) {
            acc[playerTeamId] = {
                teamImage: player.teamImage,
                players: []
            }
        }

        acc[playerTeamId].players.push(player)

        return acc
    }, {} as Record<string, Team>)

    return { allPlayers, playersWithTeams }
}

export async function playerData(playerId: string) {
    const token = await getTempToken()
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/mlb/player/' + playerId, {
        headers: {
            'tempToken': token
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch MLB player data')
    }

    return await res.json() as PlayerData[]
}
