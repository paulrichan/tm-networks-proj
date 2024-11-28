import { mlbPlayers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function usePlayers() {
    return useQuery({
        queryKey: ['mlbPlayers'],
        queryFn: async () => await mlbPlayers()
    })
}