// components/navbar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Trophy, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { createClient } from "@/lib/supabase/client"
export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Get current session
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Error checking session:", sessionError.message)
        router.push("/login")
        return
      }

      if (!session) {
        console.log("No active session to logout from")
        router.push("/login")
        return
      }

      console.log("Session found, attempting logout:", session.user.email)
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error("Sign out error:", signOutError.message)
        if (signOutError.message === "Auth session missing!") {
          console.log("No session to sign out, redirecting anyway")
        } else {
          throw signOutError
        }
      } else {
        console.log("Logout successful")
      }
      
      router.push("/login")
    } catch (err) {
      console.error("Unexpected error during logout:", err)
      router.push("/login")
    }
  }

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
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Clasificación
          </Link>
          <Link
            href="/teams"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/teams" ? "text-primary" : "text-muted-foreground"
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
              pathname === "/partidos" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-1">Partidos</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}