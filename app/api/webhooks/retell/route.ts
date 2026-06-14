import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = await request.json();

  // TODO: only use this route when Retell is connected directly instead of via GHL.
  return NextResponse.json({
    received: true,
    source: "retell",
    callId: event.call_id ?? event.call?.call_id ?? "unknown"
  });
}
