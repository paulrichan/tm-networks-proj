"use client"

import { SidebarClose } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={`relative z-10 hidden md:block`}>
            <div className="border-r-2 fixed left-0 w-64 h-[calc(100vh-4rem)] mt-16 p-2 overflow-auto backdrop-blur-2xl">
                {children}
            </div>
        </div>
    )
}