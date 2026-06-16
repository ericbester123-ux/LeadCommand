import type { Appointment, CampaignMetric, Lead, LeadStatus } from "@/lib/types";

type DbLeadRow = {
  id: string;
  client_id: string | null;
  full_name: string;
  source: string;
  neighborhood: string | null;
  budget: string | null;
  status: LeadStatus;
  score: number;
  next_action: string | null;
  updated_at: string;
  ai_calls?: Array<{
    summary: string;
    created_at: string;
  }> | null;
};

type DbAppointmentRow = {
  id: string;
  client_id: string | null;
  appointment_type: string;
  starts_at: string;
  status: string;
  leads?:
    | {
        full_name: string | null;
      }
    | Array<{
        full_name: string | null;
      }>
    | null;
};

type DbCampaignMetricRow = {
  metric_date: string;
  leads: number;
  booked: number;
  spend: number | string;
  client_id: string | null;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatRelativeTime(isoDate: string, now = new Date()) {
  const date = new Date(isoDate);
  const diffMinutes = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 60000)
  );

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function formatAppointmentDateTime(startsAt: string, now = new Date()) {
  const date = new Date(startsAt);
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const appointmentDay = startOfDay(date);

  let dateLabel = date.toLocaleDateString("en-US", { weekday: "long" });

  if (appointmentDay.getTime() === today.getTime()) {
    dateLabel = "Today";
  } else if (appointmentDay.getTime() === tomorrow.getTime()) {
    dateLabel = "Tomorrow";
  }

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  return { date: dateLabel, time };
}

export function formatMetricDay(metricDate: string) {
  return new Date(`${metricDate}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short"
  });
}

export function mapLeadRow(row: DbLeadRow): Lead {
  const latestCall = [...(row.ai_calls ?? [])].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  )[0];

  return {
    clientId: row.client_id ?? "",
    id: row.id,
    name: row.full_name,
    source: row.source,
    neighborhood: row.neighborhood ?? "",
    budget: row.budget ?? "",
    status: row.status,
    score: row.score,
    lastContact: formatRelativeTime(row.updated_at),
    aiSummary: latestCall?.summary ?? "No AI call summary yet.",
    nextAction: row.next_action ?? "Review lead details"
  };
}

export function mapAppointmentRow(row: DbAppointmentRow): Appointment {
  const { date, time } = formatAppointmentDateTime(row.starts_at);
  const lead = Array.isArray(row.leads) ? row.leads[0] : row.leads;

  return {
    clientId: row.client_id ?? "",
    id: row.id,
    client: lead?.full_name ?? "Lead",
    date,
    time,
    type: row.appointment_type,
    status: row.status === "Confirmed" ? "Confirmed" : "Pending"
  };
}

export function mapCampaignMetricRow(row: DbCampaignMetricRow): CampaignMetric {
  return {
    clientId: row.client_id ?? "",
    name: formatMetricDay(row.metric_date),
    leads: row.leads,
    booked: row.booked,
    spend: Number(row.spend)
  };
}
