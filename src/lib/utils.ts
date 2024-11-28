import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const teamLookup = {
  "108": { "name": "Los Angeles Angels", "abbreviation": "LAA" },
  "109": { "name": "Arizona Diamondbacks", "abbreviation": "ARI" },
  "110": { "name": "Baltimore Orioles", "abbreviation": "BAL" },
  "111": { "name": "Boston Red Sox", "abbreviation": "BOS" },
  "112": { "name": "Chicago Cubs", "abbreviation": "CHC" },
  "113": { "name": "Cincinnati Reds", "abbreviation": "CIN" },
  "114": { "name": "Cleveland Guardians", "abbreviation": "CLE" },
  "115": { "name": "Colorado Rockies", "abbreviation": "COL" },
  "116": { "name": "Detroit Tigers", "abbreviation": "DET" },
  "117": { "name": "Houston Astros", "abbreviation": "HOU" },
  "118": { "name": "Kansas City Royals", "abbreviation": "KC" },
  "119": { "name": "Los Angeles Dodgers", "abbreviation": "LAD" },
  "120": { "name": "Washington Nationals", "abbreviation": "WSH" },
  "121": { "name": "New York Mets", "abbreviation": "NYM" },
  "133": { "name": "Oakland Athletics", "abbreviation": "OAK" },
  "134": { "name": "Pittsburgh Pirates", "abbreviation": "PIT" },
  "135": { "name": "San Diego Padres", "abbreviation": "SD" },
  "136": { "name": "Seattle Mariners", "abbreviation": "SEA" },
  "137": { "name": "San Francisco Giants", "abbreviation": "SF" },
  "138": { "name": "St. Louis Cardinals", "abbreviation": "STL" },
  "139": { "name": "Tampa Bay Rays", "abbreviation": "TB" },
  "140": { "name": "Texas Rangers", "abbreviation": "TEX" },
  "141": { "name": "Toronto Blue Jays", "abbreviation": "TOR" },
  "142": { "name": "Minnesota Twins", "abbreviation": "MIN" },
  "143": { "name": "Philadelphia Phillies", "abbreviation": "PHI" },
  "144": { "name": "Atlanta Braves", "abbreviation": "ATL" },
  "145": { "name": "Chicago White Sox", "abbreviation": "CWS" },
  "146": { "name": "Miami Marlins", "abbreviation": "MIA" },
  "147": { "name": "New York Yankees", "abbreviation": "NYY" },
  "158": { "name": "Milwaukee Brewers", "abbreviation": "MIL" }
} as { [key: string]: { name: string; abbreviation: string } }

export const gameStats = (data: GameStats[]) => {
  // sort the data just to make sure it's in the right order
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let runningTotals = {
    PA: 0,
    AB: 0,
    H: 0,
    HR: 0,
    BB: 0,
    K: 0,
    HBP: 0,
    SF: 0,
    RBI: 0,
    TB: 0
  }

  const allCumulativeStats = sortedData.map((game, idx) => {
    runningTotals.PA += game.PA
    runningTotals.AB += game.AB
    runningTotals.H += game.H
    runningTotals.HR += game.HR
    runningTotals.BB += game.BB
    runningTotals.K += game.K
    runningTotals.HBP += game.HBP
    runningTotals.SF += game.SF
    runningTotals.RBI += game.RBI
    runningTotals.TB += game.TB

    const AVG = runningTotals.AB > 0 ? runningTotals.H / runningTotals.AB : 0
    const OBP = (runningTotals.PA - runningTotals.SF) > 0 ?
      (runningTotals.H + runningTotals.BB + runningTotals.HBP) / (runningTotals.AB + runningTotals.BB + runningTotals.HBP) : 0
    const SLG = runningTotals.AB > 0 ? runningTotals.TB / runningTotals.AB : 0

    return {
      date: game.date,
      games: idx + 1,
      PA: runningTotals.PA,
      AB: runningTotals.AB,
      H: runningTotals.H,
      HR: runningTotals.HR,
      BB: runningTotals.BB,
      K: runningTotals.K,
      HBP: runningTotals.HBP,
      SF: runningTotals.SF,
      RBI: runningTotals.RBI,
      TB: runningTotals.TB,
      AVG: Number(AVG.toFixed(3)),
      OBP: Number(OBP.toFixed(3)),
      SLG: Number(SLG.toFixed(3)),
      OPS: Number((OBP + SLG).toFixed(3)
      )
    }
  })

  return {
    allCumulativeStats,
    lastGame: allCumulativeStats[allCumulativeStats.length - 1],
    weeklyStats: getWeeklyStats(data),
    monthlyStats: getMonthlyStats(data)
  }
}

const getWeeklyStats = (data: GameStats[]): ChartStats[] => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningTotals = {
    PA: 0,
    AB: 0,
    H: 0,
    HR: 0,
    BB: 0,
    HBP: 0,
    SF: 0,
    TB: 0,
    RBI: 0
  };

  // Group by week
  const weekMap = sortedData.reduce((acc, game) => {
    const weekDate = new Date(game.date);
    weekDate.setDate(weekDate.getDate() - weekDate.getDay());
    const weekKey = weekDate.toISOString().split('T')[0];

    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(game);
    return acc;
  }, {} as Record<string, GameStats[]>);

  return Object.entries(weekMap).map(([weekStart, games]) => {
    // Add current games to running totals
    games.forEach(game => {
      runningTotals.PA += game.PA;
      runningTotals.AB += game.AB;
      runningTotals.H += game.H;
      runningTotals.HR += game.HR;
      runningTotals.BB += game.BB;
      runningTotals.HBP += game.HBP;
      runningTotals.SF += game.SF;
      runningTotals.TB += game.TB;
      runningTotals.RBI += game.RBI;
    });

    const AVG = runningTotals.AB > 0 ? runningTotals.H / runningTotals.AB : 0;
    const OBP = (runningTotals.PA - runningTotals.SF) > 0 ?
      (runningTotals.H + runningTotals.BB + runningTotals.HBP) /
      (runningTotals.AB + runningTotals.BB + runningTotals.HBP) : 0;
    const SLG = runningTotals.AB > 0 ? runningTotals.TB / runningTotals.AB : 0;

    return {
      date: weekStart,
      games: games.length,
      PA: runningTotals.PA,
      AVG: Number(AVG.toFixed(3)),
      OBP: Number(OBP.toFixed(3)),
      SLG: Number(SLG.toFixed(3)),
      OPS: Number((OBP + SLG).toFixed(3)),
      HR: runningTotals.HR,
      RBI: runningTotals.RBI
    };
  });
};

const getMonthlyStats = (data: GameStats[]): ChartStats[] => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningTotals = {
    PA: 0,
    AB: 0,
    H: 0,
    HR: 0,
    BB: 0,
    HBP: 0,
    SF: 0,
    TB: 0,
    RBI: 0
  };

  // Group by month
  const monthMap = sortedData.reduce((acc, game) => {
    const monthKey = game.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(game);
    return acc;
  }, {} as Record<string, GameStats[]>);

  return Object.entries(monthMap).map(([month, games]) => {
    // Add current games to running totals
    games.forEach(game => {
      runningTotals.PA += game.PA;
      runningTotals.AB += game.AB;
      runningTotals.H += game.H;
      runningTotals.HR += game.HR;
      runningTotals.BB += game.BB;
      runningTotals.HBP += game.HBP;
      runningTotals.SF += game.SF;
      runningTotals.TB += game.TB;
      runningTotals.RBI += game.RBI;
    });

    const AVG = runningTotals.AB > 0 ? runningTotals.H / runningTotals.AB : 0;
    const OBP = (runningTotals.PA - runningTotals.SF) > 0 ?
      (runningTotals.H + runningTotals.BB + runningTotals.HBP) /
      (runningTotals.AB + runningTotals.BB + runningTotals.HBP) : 0;
    const SLG = runningTotals.AB > 0 ? runningTotals.TB / runningTotals.AB : 0;

    return {
      date: `${month}-01`, // First day of month for consistent charting
      games: games.length,
      PA: runningTotals.PA,
      AVG: Number(AVG.toFixed(3)),
      OBP: Number(OBP.toFixed(3)),
      SLG: Number(SLG.toFixed(3)),
      OPS: Number((OBP + SLG).toFixed(3)),
      HR: runningTotals.HR,
      RBI: runningTotals.RBI
    };
  });
};

const calculateStats = (games: GameStats[]): AggregatedStats => {
  const totalPA = games.reduce((sum, game) => sum + game.PA, 0);
  const totalAB = games.reduce((sum, game) => sum + game.AB, 0);
  const totalH = games.reduce((sum, game) => sum + game.H, 0);
  const totalHR = games.reduce((sum, game) => sum + game.HR, 0);
  const totalBB = games.reduce((sum, game) => sum + game.BB, 0);
  const totalK = games.reduce((sum, game) => sum + game.K, 0);
  const totalHBP = games.reduce((sum, game) => sum + game.HBP, 0);
  const totalSF = games.reduce((sum, game) => sum + game.SF, 0);
  const totalTB = games.reduce((sum, game) => sum + game.TB, 0);
  const totalRBI = games.reduce((sum, game) => sum + game.RBI, 0);

  const AVG = totalAB > 0 ? totalH / totalAB : 0;
  const OBP = (totalPA - totalSF) > 0 ?
    (totalH + totalBB + totalHBP) / (totalAB + totalBB + totalHBP) : 0;
  const SLG = totalAB > 0 ? totalTB / totalAB : 0;

  return {
    startDate: games[0].date,
    endDate: games[games.length - 1].date,
    month: games[0].date.substring(0, 7),
    games: games.length,
    PA: totalPA,
    AVG: Number(AVG.toFixed(3)),
    OBP: Number(OBP.toFixed(3)),
    SLG: Number(SLG.toFixed(3)),
    OPS: Number((OBP + SLG).toFixed(3)),
    HR: totalHR,
    RBI: totalRBI,
    BB: totalBB,
    K: totalK
  };
};

export const aggregateByMonth = (data: GameStats[]): AggregatedStats[] => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group games by month
  const monthlyGames = sortedData.reduce((acc, game) => {
    const monthKey = game.date.substring(0, 7); // YYYY-MM format
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(game);
    return acc;
  }, {} as Record<string, GameStats[]>);

  // Calculate stats for each month
  return Object.values(monthlyGames).map(games => calculateStats(games));
};



