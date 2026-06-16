import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { clientProfiles, defaultClientProfile } from "@/lib/clients";
import {
  mapAppointmentRow,
  mapCampaignMetricRow,
  mapLeadRow
} from "@/lib/db-mappers";
import { getMockClientData } from "@/lib/mock-data";
import type { Appointment, CampaignMetric, Lead } from "@/lib/types";

export const unassignedClientId = "__unassigned__";

export type ClientData = {
  appointments: Appointment[];
  campaignMetrics: CampaignMetric[];
  leads: Lead[];
};

const emptyClientData: ClientData = {
  appointments: [],
  campaignMetrics: [],
  leads: []
};

export function getSelectedClientId(
  requestedClientId?: string,
  allowedClientIds?: string[]
) {
  if (allowedClientIds && !allowedClientIds.length) {
    return unassignedClientId;
  }

  if (
    requestedClientId &&
    (!allowedClientIds?.length || allowedClientIds.includes(requestedClientId))
  ) {
    return requestedClientId;
  }

  return allowedClientIds?.[0] ?? defaultClientProfile.id;
}

export async function resolveActiveClientIdForPage(
  requestedClientId?: string,
  allowedClientIds?: string[]
) {
  const selectedClientId = getSelectedClientId(
    requestedClientId,
    allowedClientIds
  );

  if (
    selectedClientId !== defaultClientProfile.id &&
    selectedClientId !== unassignedClientId
  ) {
    return selectedClientId;
  }

  if (!hasSupabaseConfig()) {
    return selectedClientId;
  }

  try {
    const supabase = createServerComponentClient({ cookies });
    const { data } = await supabase
      .from("clients")
      .select("id")
      .order("created_at", { ascending: true });

    const availableIds = [
      ...clientProfiles.map((client) => client.id),
      ...(data ?? []).map((client) => client.id)
    ].filter(Boolean);

    if (!availableIds.length) {
      return selectedClientId;
    }

    if (
      requestedClientId &&
      availableIds.includes(requestedClientId) &&
      (!allowedClientIds?.length || allowedClientIds.includes(requestedClientId))
    ) {
      return requestedClientId;
    }

    if (allowedClientIds?.length) {
      const allowedMatch = allowedClientIds.find((clientId) =>
        availableIds.includes(clientId)
      );

      if (allowedMatch) {
        return allowedMatch;
      }
    }

    return availableIds[0] ?? selectedClientId;
  } catch {
    return selectedClientId;
  }
}

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function getClientDataFromDatabase(clientId: string): Promise<ClientData> {
  const supabase = createServerComponentClient({ cookies });
  const nowIso = new Date().toISOString();

  const [leadsResult, appointmentsResult, metricsResult] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "id, client_id, full_name, source, neighborhood, budget, status, score, next_action, updated_at, ai_calls(summary, created_at)"
      )
      .eq("client_id", clientId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("appointments")
      .select(
        "id, client_id, appointment_type, starts_at, status, leads(full_name)"
      )
      .eq("client_id", clientId)
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true }),
    supabase
      .from("campaign_metrics")
      .select("client_id, metric_date, leads, booked, spend")
      .eq("client_id", clientId)
      .order("metric_date", { ascending: true })
      .limit(14)
  ]);

  return {
    leads: (leadsResult.data ?? []).map(mapLeadRow),
    appointments: (appointmentsResult.data ?? []).map(mapAppointmentRow),
    campaignMetrics: (metricsResult.data ?? []).map(mapCampaignMetricRow)
  };
}

function hasDatabaseContent(data: ClientData) {
  return (
    data.leads.length > 0 ||
    data.appointments.length > 0 ||
    data.campaignMetrics.length > 0
  );
}

export async function getClientData(clientId: string): Promise<ClientData> {
  if (clientId === unassignedClientId) {
    return emptyClientData;
  }

  if (hasSupabaseConfig()) {
    try {
      const databaseData = await getClientDataFromDatabase(clientId);

      if (hasDatabaseContent(databaseData)) {
        return databaseData;
      }
    } catch {
      // Fall back to local demo data when Supabase is unavailable.
    }
  }

  return getMockClientData(clientId);
}

export async function getDashboardStats(clientId: string) {
  const { appointments, leads } = await getClientData(clientId);
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const hotLeads = leads.filter((lead) => lead.status === "Hot").length;
  const needsAgent = leads.filter((lead) => lead.status === "Needs Agent").length;
  const bookedLeads = leads.filter((lead) => lead.status === "Booked").length;
  const aiCallsCompleted = leads.filter((lead) => lead.status !== "New").length;

  return {
    aiCallsCompleted,
    appointments: bookedLeads + appointments.length,
    hotLeads,
    needsAgent,
    newLeads: newLeads || leads.length,
    totalLeads: leads.length
  };
}
