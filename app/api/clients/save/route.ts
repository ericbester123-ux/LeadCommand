import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminApiAccess } from "@/lib/admin-api";

type SaveClientRequest = {
  brokerage?: string;
  ghlLocationId?: string;
  locationName?: string;
  market?: string;
  name?: string;
};

export async function POST(request: Request) {
  const accessError = await requireAdminApiAccess();
  if (accessError) {
    return accessError;
  }

  const body = (await request.json()) as SaveClientRequest;

  if (!body.name || !body.locationName) {
    return NextResponse.json(
      { message: "Client name and location name are required." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      message:
        "Client accepted for this session. Add Supabase service role settings to save clients permanently."
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      name: body.name,
      brokerage: body.brokerage || null,
      location_name: body.locationName,
      ghl_location_id: body.ghlLocationId || null,
      market: body.market || null,
      status: body.ghlLocationId ? "Connected" : "Needs Setup"
    })
    .select("id, name, brokerage, location_name, ghl_location_id, market, status")
    .single();

  if (error || !client) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    client: {
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
    },
    message: "Client location saved."
  });
}
