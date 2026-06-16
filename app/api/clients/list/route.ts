import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";
import { clientProfiles } from "@/lib/clients";

export const dynamic = "force-dynamic";

export async function GET() {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const headers = {
    "Cache-Control": "no-store"
  };
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ clients: clientProfiles }, { headers });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, brokerage, location_name, ghl_location_id, market, status")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { clients: clientProfiles, message: error.message },
      { headers }
    );
  }

  const clients =
    data?.map((client) => ({
      id: client.id,
      agentName: client.name,
      brokerage: client.brokerage ?? "",
      locationName: client.location_name,
      ghlLocationId: client.ghl_location_id ?? "",
      market: client.market ?? "",
      status: client.status === "Connected" ? "Connected" : "Needs Setup",
      lastSync:
        client.status === "Connected"
          ? "Connected"
          : "Awaiting integration setup"
    })) ?? clientProfiles;

  return NextResponse.json(
    { clients: clients.length ? clients : clientProfiles },
    { headers }
  );
}
