import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type GhlWebhookEvent = {
  type?: string;
  eventType?: string;
  locationId?: string;
  contact?: GhlContact;
  appointment?: GhlAppointment;
  data?: {
    contact?: GhlContact;
    appointment?: GhlAppointment;
    locationId?: string;
  };
};

type GhlContact = {
  id?: string;
  contactId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  locationId?: string;
  city?: string;
  tags?: string[];
};

type GhlAppointment = {
  id?: string;
  calendarEventId?: string;
  calendarId?: string;
  contactId?: string;
  title?: string;
  startTime?: string;
  status?: string;
};

function getContactName(contact: GhlContact) {
  return (
    contact.name ||
    [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
    "Unknown Lead"
  );
}

async function resolveClientId(locationId?: string) {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const resolvedLocationId = locationId || process.env.GHL_LOCATION_ID;

  if (!resolvedLocationId) {
    const { data: fallbackClient } = await admin
      .from("clients")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    return fallbackClient?.id ?? null;
  }

  const { data: client } = await admin
    .from("clients")
    .select("id")
    .eq("ghl_location_id", resolvedLocationId)
    .maybeSingle();

  if (client?.id) {
    return client.id;
  }

  const { data: fallbackClient } = await admin
    .from("clients")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return fallbackClient?.id ?? null;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.GHL_WEBHOOK_SECRET;

  if (
    expectedSecret &&
    request.headers.get("x-leadcommand-webhook-secret") !== expectedSecret
  ) {
    return NextResponse.json({ message: "Invalid webhook secret." }, { status: 401 });
  }

  const event = (await request.json()) as GhlWebhookEvent;
  const admin = getSupabaseAdminClient();
  const eventType = event.type ?? event.eventType ?? "unknown";

  if (!admin) {
    return NextResponse.json({
      received: true,
      persisted: false,
      source: "gohighlevel",
      eventType,
      message: "Supabase service role is not configured."
    });
  }

  const contact = event.contact ?? event.data?.contact;
  const appointment = event.appointment ?? event.data?.appointment;
  const locationId = event.locationId ?? event.data?.locationId ?? contact?.locationId;
  const clientId = await resolveClientId(locationId);

  if (!clientId) {
    return NextResponse.json({
      received: true,
      persisted: false,
      source: "gohighlevel",
      eventType,
      message: "No client location found for this webhook."
    });
  }

  if (contact) {
    const ghlContactId = contact.id ?? contact.contactId;

    if (ghlContactId) {
      await admin.from("leads").upsert(
        {
          client_id: clientId,
          ghl_contact_id: ghlContactId,
          full_name: getContactName(contact),
          email: contact.email ?? null,
          phone: contact.phone ?? null,
          source: contact.source ?? "GoHighLevel",
          neighborhood: contact.city ?? null,
          status: "New",
          updated_at: new Date().toISOString()
        },
        { onConflict: "ghl_contact_id" }
      );
    }
  }

  if (appointment?.startTime) {
    const ghlContactId = appointment.contactId;
    let leadId: string | null = null;

    if (ghlContactId) {
      const { data: lead } = await admin
        .from("leads")
        .select("id")
        .eq("ghl_contact_id", ghlContactId)
        .maybeSingle();

      leadId = lead?.id ?? null;
    }

    if (leadId) {
      await admin.from("appointments").upsert(
        {
          client_id: clientId,
          lead_id: leadId,
          ghl_calendar_event_id:
            appointment.id ?? appointment.calendarEventId ?? undefined,
          ghl_calendar_id: appointment.calendarId ?? null,
          appointment_type: appointment.title ?? "Consultation",
          starts_at: appointment.startTime,
          status: appointment.status ?? "Pending",
          updated_at: new Date().toISOString()
        },
        { onConflict: "ghl_calendar_event_id" }
      );
    }
  }

  return NextResponse.json({
    received: true,
    persisted: true,
    source: "gohighlevel",
    eventType
  });
}
