import { playerData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function usePlayerData(playerId: string) {
    return useQuery({
        queryKey: ['playerData'],
        queryFn: async () => playerData(playerId),
        enabled: !!playerId,
    })
}