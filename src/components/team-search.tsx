"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn, teamLookup } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import usePlayers from "@/hooks/use-players"
import { useParams, useRouter } from "next/navigation"

export function TeamSearch() {
    const [open, setOpen] = React.useState(false)
    const params = useParams()
    const router = useRouter()
    const [value, setValue] = React.useState(params.teamId)
    const { data, isLoading } = usePlayers()

    if (isLoading || !data) {
        return <p>Loading...</p>
    }

    const playersWithTeams = data?.playersWithTeams

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? teamLookup[value as string].name
                        : "Select team..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search team..." />
                    <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup>
                            {Object.entries(playersWithTeams).map(([teamId, team]) => (
                                <CommandItem
                                    key={teamId}
                                    value={teamId}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        router.push(`/${teamId}`)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === teamId ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {teamLookup[teamId].name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
