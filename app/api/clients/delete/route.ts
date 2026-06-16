import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";

type DeleteClientRequest = {
  clientId?: string;
};

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as DeleteClientRequest;

  if (!body.clientId) {
    return NextResponse.json(
      { message: "Client location is required." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "Location removed for this session. Add Supabase service role settings to remove locations permanently."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", body.clientId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Client location removed." });
}
