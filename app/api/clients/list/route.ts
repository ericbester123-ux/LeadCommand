import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { clientProfiles } from "@/lib/clients";

export const dynamic = "force-dynamic";

function mapClientRows(
  rows: Array<{
    id: string;
    name: string;
    brokerage: string | null;
    location_name: string;
    ghl_location_id: string | null;
    market: string | null;
    status: string;
  }>
) {
  return rows.map((client) => ({
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
  }));
}

function mergeDemoClients(clients: ReturnType<typeof mapClientRows>) {
  const clientIds = new Set(clients.map((client) => client.id));
  const missingDemoClients = clientProfiles.filter(
    (client) => !clientIds.has(client.id)
  );

  return [...missingDemoClients, ...clients];
}

export async function GET() {
  const headers = {
    "Cache-Control": "no-store"
  };
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ clients: clientProfiles }, { headers });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Login required.", clients: clientProfiles },
      { status: 401, headers }
    );
  }

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, brokerage, location_name, ghl_location_id, market, status")
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return NextResponse.json(
      { clients: clientProfiles, message: error?.message },
      { headers }
    );
  }

  return NextResponse.json(
    { clients: mergeDemoClients(mapClientRows(data)) },
    { headers }
  );
}
