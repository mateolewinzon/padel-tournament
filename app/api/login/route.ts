// app/api/login/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  // Attempt to log in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: "No user ID returned" }, { status: 500 });
  }

  // Check user's role
  const userId = data.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ redirect: "/teams" }, { status: 200 });
}
