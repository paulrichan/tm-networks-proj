"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePlayerData } from "@/hooks/use-player-data";
import usePlayers from "@/hooks/use-players";
import { aggregateByMonth, gameStats, teamLookup } from "@/lib/utils";
import { useParams } from "next/navigation";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TeamSearch } from "@/components/team-search";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig


const radarChartConfig = {
    desktop: {
        label: "AVG",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function Page() {
    const { data: allPlayers } = usePlayers()
    const { teamId, playerId } = useParams()
    const { data: playerData } = usePlayerData(playerId as string)
    const [statsPeriod, setStatsPeriod] = useState('month')
    const [dataKey, setDataKey] = useState('AVG')

    if (!playerData || !allPlayers) {
        return <p>Loading...</p>
    }

    const chartData = gameStats(playerData)
    const playerDetails = {
        position: playerData[0].pos,
        bats: playerData[0].batsHand,
        throws: playerData[0].throwsHand,
        playerImage: allPlayers?.allPlayers.find(player => String(player.playerId) === playerId)?.playerImage,
        playerFullName: allPlayers?.allPlayers.find(player => String(player.playerId) === playerId)?.playerFullName,
    }
    const xAxisDateOptions = statsPeriod === 'month' ? {
        month: 'long',
    } : {
        dateStyle: 'short',
    } as any
    const monthlyStats = aggregateByMonth(playerData);

    return (
        <div className="space-y-4 w-full max-w-[1400px]">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${teamId}`} className="flex items-center gap-2">
                            <Avatar className="w-4 h-4">
                                <AvatarImage src={`${allPlayers?.playersWithTeams[teamId as string].teamImage}`} alt={teamLookup[teamId as string].name} />
                            </Avatar>
                            {teamLookup[teamId as string].name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${teamId}/${playerId}`}>{playerDetails.playerFullName}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <div>
                    <div className="flex items-center">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src={playerDetails.playerImage} alt={playerDetails.playerFullName} />
                        </Avatar>

                        <div>
                            <h2 className="text-2xl font-bold">{playerDetails.playerFullName}</h2>
                            <div className="flex flex-wrap gap-2">
                                <Card className="w-24">
                                    <CardHeader className="p-3">
                                        <CardDescription>Position</CardDescription>
                                        <CardTitle>{playerDetails.position}</CardTitle>
                                    </CardHeader>
                                </Card>

                                <Card className="w-24">
                                    <CardHeader className="p-3">
                                        <CardDescription>Bats</CardDescription>
                                        <CardTitle>{playerDetails.bats}</CardTitle>
                                    </CardHeader>
                                </Card>

                                <Card className="w-24">
                                    <CardHeader className="p-3">
                                        <CardDescription>Throws</CardDescription>
                                        <CardTitle>{playerDetails.throws}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-bold">End Season Key Stats</h3>

                        <div className="flex gap-2 flex-wrap">
                            {Object.keys(chartData.lastGame).filter(key => ['HR', 'H', 'AVG', 'OBP', 'SLG', 'OPS'].includes(key)).map((key) => {
                                return (
                                    <Card className="w-24" key={key}>
                                        <CardHeader className="p-3">
                                            <CardDescription>{key}</CardDescription>
                                            <CardTitle>{(chartData.lastGame as any)[key]}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                )

                            })}
                        </div>
                    </div>
                </div>

                <Card className="p-3 flex-1 w-full min-w-[250px]">
                    <CardHeader className="p-0 mb-2">
                        <h4 className="font-bold text-sm text-muted-foreground">AVG per Month</h4>

                    </CardHeader>
                    <ChartContainer
                        config={radarChartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <RadarChart data={monthlyStats}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis dataKey="month" tickFormatter={(value) => new Date(value).toLocaleString('default', { month: 'long' })} />
                            <PolarGrid />
                            <Radar
                                dataKey="AVG"
                                fill="var(--color-desktop)"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ChartContainer>
                </Card>
            </div>


            <Card className="p-3">
                <CardHeader className="p-0 mb-2">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-muted-foreground">Cumulative Stats by </h4>
                            <Select
                                onValueChange={(val) => {
                                    setStatsPeriod(val)
                                }}
                                defaultValue="month"
                            >
                                <SelectTrigger className="w-fit">
                                    <SelectValue placeholder="Select a stat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="month">Month</SelectItem>
                                        <SelectItem value="week">Week</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <Select
                            onValueChange={(val) => {
                                setDataKey(val)
                            }}
                            value={dataKey}
                        >
                            <SelectTrigger className="w-fit">
                                <SelectValue placeholder="Select a period to filter by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {Object.keys(chartData.lastGame).filter((key) => ['AVG', 'OBP', 'SLG', 'OPS'].includes(key)).map((key) => {
                                        return (
                                            <SelectItem key={key} value={key}>{key}</SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={statsPeriod === 'month' ? chartData.monthlyStats : chartData.weeklyStats}
                        margin={{
                            left: -12,
                            right: 12,
                        }}

                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => new Date(value).toLocaleString('default', { ...xAxisDateOptions })}
                        />
                        <YAxis
                            dataKey={dataKey}
                            tickFormatter={(value) => value.toFixed(3)}
                            domain={[0, (dataMax: any) => dataMax * 1.25]}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey={dataKey}
                            type="monotone"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </Card>
        </div>
    );
}