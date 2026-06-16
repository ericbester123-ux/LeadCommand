import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

function isConfiguredAdmin(email: string) {
  const adminEmails = process.env.LEADCOMMAND_ADMIN_EMAILS ?? "";

  return adminEmails
    .split(",")
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export async function requireAdminApiAccess() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user.email) {
    return NextResponse.json(
      { message: "Admin login required." },
      { status: 401 }
    );
  }

  if (!isConfiguredAdmin(session.user.email)) {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 403 }
    );
  }

  return null;
}
