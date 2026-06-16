import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";

type CreateUserRequest = {
  clientId?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as CreateUserRequest;

  if (!body.clientId || !body.email || !body.password) {
    return NextResponse.json(
      { message: "Client, email, and password are required." },
      { status: 400 }
    );
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { message: "Temporary password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "User prepared for this session. Add Supabase service role settings to create users permanently."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const email = body.email.toLowerCase().trim();

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: true
    });
  const existingUser =
    createError?.message.toLowerCase().includes("already") ?? false;

  if (createError && !createError.message.toLowerCase().includes("already")) {
    return NextResponse.json({ message: createError.message }, { status: 500 });
  }

  let userId = created.user?.id;

  if (!userId) {
    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      return NextResponse.json({ message: userError.message }, { status: 500 });
    }

    userId = users.users.find((user) => user.email?.toLowerCase() === email)?.id;
  }

  if (!userId) {
    return NextResponse.json(
      { message: "Could not find or create this user." },
      { status: 500 }
    );
  }

  if (existingUser) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email_confirm: true,
        password: body.password
      }
    );

    if (updateError) {
      return NextResponse.json(
        { message: updateError.message },
        { status: 500 }
      );
    }
  }

  const fullName = email.split("@")[0].replace(/[._-]/g, " ");

  await supabase.from("agents").upsert({
    id: userId,
    full_name: fullName,
    role: "agent",
    updated_at: new Date().toISOString()
  });

  const { error: membershipError } = await supabase
    .from("client_memberships")
    .upsert(
      {
        client_id: body.clientId,
        agent_id: userId,
        role: "agent"
      },
      { onConflict: "client_id,agent_id" }
    );

  if (membershipError) {
    return NextResponse.json(
      { message: membershipError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message:
      "User created or updated and assigned. Share the email and temporary password with the client securely."
  });
}
