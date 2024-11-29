interface TokenData {
    token: string
    expires: string
}

interface Player {
    playerId: number
    playerFullName: string
    playerImage: string
    teamImage: string
}

interface Team {
    teamImage: string
    players: Player[]
}

interface PlayerData {
    playerId: number
    abbrevName: string
    playerFullName: string
    player: string
    pos: string
    currentTeamName: string
    currentTeamAbbrevName: string
    currentTeamId: number
    currentTeamLocation: string
    currentTeamLevel: string
    currentOrg: string
    newestTeamName: string
    newestTeamAbbrevName: string
    newestTeamId: number
    newestTeamLocation: string
    newestTeamLevel: string
    newestOrg: string
    batsHand: string
    throwsHand: string
    PA: number
    AB: number
    H: number
    HR: number
    BB: number
    K: number
    HBP: number
    SF: number
    TB: number
    RBI: number
    gameId: number
    opponentId: number
    opponentToken: string
    opponent: string
    date: string
    result: string
    win: boolean
    home: boolean
    away: boolean
    playerImage: string
    teamImage: string
    oppImage: string
}

interface GameStats {
    playerId: number;
    playerFullName: string;
    PA: number;
    AB: number;
    H: number;
    HR: number;
    BB: number;
    K: number;
    HBP: number;
    SF: number;
    TB: number;
    RBI: number;
    date: string;
}

interface AggregatedStats {
    startDate: string;
    endDate: string;
    games: number;
    PA: number;
    AVG: number;
    OBP: number;
    SLG: number;
    OPS: number;
    HR: number;
    RBI: number;
    BB: number;
    K: number;
}

interface CumulativeStats {
    date: string;
    games: number;
    PA: number;
    AB: number;
    H: number;
    HR: number;
    BB: number;
    K: number;
    RBI: number;
    TB: number;
    AVG: number;
    OBP: number;
    SLG: number;
    OPS: number;
}

interface ChartStats {
    date: string;
    games: number;
    PA: number;
    AVG: number;
    OBP: number;
    SLG: number;
    OPS: number;
    HR: number;
    RBI: number;
}