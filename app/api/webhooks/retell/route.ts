import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expectedSecret = process.env.RETELL_WEBHOOK_SECRET;

  if (
    expectedSecret &&
    request.headers.get("x-leadcommand-webhook-secret") !== expectedSecret
  ) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }

  const event = await request.json();

  // TODO: only use this route when Retell is connected directly instead of via GHL.
  return NextResponse.json({
    received: true,
    source: "retell",
    callId: event.call_id ?? event.call?.call_id ?? "unknown"
  });
}
