import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { LeadStatus } from "@/lib/types";

type RetellWebhookEvent = {
  event?: string;
  call_id?: string;
  call?: {
    call_id?: string;
    call_status?: string;
    metadata?: Record<string, string>;
    retell_llm_dynamic_variables?: Record<string, string>;
  };
  call_analysis?: {
    call_summary?: string;
  };
  summary?: string;
  transcript?: string;
  sentiment?: string;
  duration_ms?: number;
  recording_url?: string;
};

function mapRetellOutcome(status?: string): LeadStatus {
  switch ((status ?? "").toLowerCase()) {
    case "ended":
    case "completed":
      return "AI Contacted";
    case "booked":
      return "Booked";
    case "hot":
      return "Hot";
    case "needs_agent":
    case "transfer":
      return "Needs Agent";
    default:
      return "AI Contacted";
  }
}

export async function POST(request: Request) {
  const expectedSecret = process.env.RETELL_WEBHOOK_SECRET;

  if (
    expectedSecret &&
    request.headers.get("x-leadcommand-webhook-secret") !== expectedSecret
  ) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }

  const event = (await request.json()) as RetellWebhookEvent;
  const admin = getSupabaseAdminClient();
  const callId = event.call_id ?? event.call?.call_id;

  if (!admin) {
    return NextResponse.json({
      received: true,
      persisted: false,
      source: "retell",
      callId: callId ?? "unknown",
      message: "Supabase service role is not configured."
    });
  }

  if (!callId) {
    return NextResponse.json({
      received: true,
      persisted: false,
      source: "retell",
      callId: "unknown",
      message: "Missing Retell call id."
    });
  }

  const metadata = {
    ...(event.call?.metadata ?? {}),
    ...(event.call?.retell_llm_dynamic_variables ?? {})
  };
  const ghlContactId = metadata.ghl_contact_id ?? metadata.contact_id;
  const leadIdFromMetadata = metadata.lead_id;
  let leadId = leadIdFromMetadata ?? null;

  if (!leadId && ghlContactId) {
    const { data: lead } = await admin
      .from("leads")
      .select("id")
      .eq("ghl_contact_id", ghlContactId)
      .maybeSingle();

    leadId = lead?.id ?? null;
  }

  if (!leadId) {
    return NextResponse.json({
      received: true,
      persisted: false,
      source: "retell",
      callId,
      message: "No matching lead found for this Retell call."
    });
  }

  const summary =
    event.call_analysis?.call_summary ??
    event.summary ??
    "Retell AI call completed.";
  const outcome = event.call?.call_status ?? event.event ?? "completed";

  await admin.from("ai_calls").upsert(
    {
      lead_id: leadId,
      retell_call_id: callId,
      ghl_contact_id: ghlContactId ?? null,
      outcome,
      summary,
      transcript: event.transcript ?? null,
      sentiment: event.sentiment ?? null,
      duration_seconds: event.duration_ms
        ? Math.round(event.duration_ms / 1000)
        : null,
      recording_url: event.recording_url ?? null
    },
    { onConflict: "retell_call_id" }
  );

  await admin
    .from("leads")
    .update({
      status: mapRetellOutcome(outcome),
      next_action: "Review AI call summary",
      updated_at: new Date().toISOString()
    })
    .eq("id", leadId);

  return NextResponse.json({
    received: true,
    persisted: true,
    source: "retell",
    callId
  });
}
