// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  console.log("Middleware - Path:", req.nextUrl.pathname, "Session:", session ? session.user.email : "No session")

  const protectedPaths = ["/", "/teams", "/partidos"]
  if (!session && protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    console.log("Middleware - No session, redirecting to /login")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/", "/teams/:path*", "/partidos/:path*"],
}