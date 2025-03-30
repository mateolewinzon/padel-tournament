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
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Check user's role
  const userId = data.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID returned" }, { status: 500 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 500 });
  }

  if (profile.role !== "admin") {
    // Log out the user if not admin and return an error
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Solo los administradores pueden acceder" },
      { status: 403 }
    );
  }

  // If admin, return success with redirect
  return NextResponse.json({ redirect: "/teams" }, { status: 200 });
}
