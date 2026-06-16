import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expectedSecret = process.env.GHL_WEBHOOK_SECRET;

  if (
    expectedSecret &&
    request.headers.get("x-leadcommand-webhook-secret") !== expectedSecret
  ) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }

  const event = await request.json();

  // TODO: map GHL contact, pipeline, calendar, and workflow events into Supabase.
  return NextResponse.json({
    received: true,
    source: "gohighlevel",
    eventType: event.type ?? event.eventType ?? "unknown"
  });
}
