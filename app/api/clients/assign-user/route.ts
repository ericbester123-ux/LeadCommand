import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";

type AssignUserRequest = {
  clientId?: string;
  email?: string;
};

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as AssignUserRequest;

  if (!body.clientId || !body.email) {
    return NextResponse.json(
      { message: "Client and user email are required." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "Assignment accepted for this session. Add Supabase service role settings to save assignments permanently."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: users, error: userError } =
    await supabase.auth.admin.listUsers();

  if (userError) {
    return NextResponse.json({ message: userError.message }, { status: 500 });
  }

  const authUser = users.users.find(
    (user) => user.email?.toLowerCase() === body.email?.toLowerCase()
  );

  if (!authUser?.email) {
    return NextResponse.json(
      {
        message:
          "Create this user in Supabase Authentication first, then assign them to the client."
      },
      { status: 404 }
    );
  }

  const fullName =
    authUser.user_metadata?.full_name ??
    authUser.email.split("@")[0].replace(/[._-]/g, " ");

  await supabase.from("agents").upsert({
    id: authUser.id,
    full_name: fullName,
    role: "agent",
    updated_at: new Date().toISOString()
  });

  const { error } = await supabase.from("client_memberships").upsert(
    {
      client_id: body.clientId,
      agent_id: authUser.id,
      role: "agent"
    },
    { onConflict: "client_id,agent_id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User assigned to client location." });
}
