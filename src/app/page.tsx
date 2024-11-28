"use client"

import PlayerList from "@/components/player-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import usePlayers from "@/hooks/use-players";
import { teamLookup } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { data, isLoading } = usePlayers()

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">All Players</h2>


      </div>

      {isLoading || !data ? <p>Loading...</p> : <PlayerList players={data.allPlayers} />
      }
    </div>
  );
}
