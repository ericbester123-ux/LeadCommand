import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = await request.json();

  // TODO: map GHL contact, pipeline, calendar, and workflow events into Supabase.
  return NextResponse.json({
    received: true,
    source: "gohighlevel",
    eventType: event.type ?? event.eventType ?? "unknown"
  });
}
