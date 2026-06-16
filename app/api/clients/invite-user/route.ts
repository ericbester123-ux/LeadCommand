import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";

type InviteUserRequest = {
  email?: string;
};

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as InviteUserRequest;

  if (!body.email) {
    return NextResponse.json(
      { message: "User email is required." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "Invite prepared. Add Supabase service role settings before sending invites."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase.auth.admin.inviteUserByEmail(body.email);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Invite sent." });
}
