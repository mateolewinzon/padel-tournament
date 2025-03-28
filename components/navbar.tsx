"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6" />
            <span className="font-bold">Torneo de Pádel</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Clasificación
          </Link>
          <Link
            href="/teams"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/teams" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Parejas
            </span>
          </Link>
          <Link
            href="/partidos"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/partidos" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-1">
              Partidos
            </span>
          </Link>
          
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

