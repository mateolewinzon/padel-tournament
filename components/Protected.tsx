"use server"

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { role } from "@prisma/client";
import { redirect } from "next/navigation";


export async function Protected({ children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const userData = await prisma.profiles.findUnique({
        where: {
            user_id: user?.id,
        },
    });

    if (userData?.role !== role.admin) {
        return redirect("/unauthorized");
    }
    return children;
}


export async function getIsAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return false;
    }

    const userData = await prisma.profiles.findUnique({
        where: {
            user_id: user?.id,
        },
    });

    return userData?.role === "admin";
}