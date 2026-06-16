import { describe, expect, it } from "vitest";
import { resolveActiveClientId } from "@/lib/active-client";
import { clientProfiles, defaultClientProfile } from "@/lib/clients";
import {
  formatAppointmentDateTime,
  formatMetricDay,
  formatRelativeTime,
  mapAppointmentRow,
  mapCampaignMetricRow,
  mapLeadRow
} from "@/lib/db-mappers";
import { getSelectedClientId, unassignedClientId } from "@/lib/data";

describe("getSelectedClientId", () => {
  it("returns the requested client when allowed", () => {
    expect(getSelectedClientId("client-a", ["client-a", "client-b"])).toBe(
      "client-a"
    );
  });

  it("returns unassigned when no memberships exist", () => {
    expect(getSelectedClientId(undefined, [])).toBe(unassignedClientId);
  });

  it("falls back to the first allowed client", () => {
    expect(getSelectedClientId(undefined, ["client-b"])).toBe("client-b");
  });
});

describe("resolveActiveClientId", () => {
  it("prefers the URL client id when it exists in available clients", () => {
    const availableClients = [
      ...clientProfiles,
      {
        ...clientProfiles[0],
        id: "client-b",
        locationName: "Client B"
      }
    ];

    expect(
      resolveActiveClientId(
        "client-b",
        defaultClientProfile.id,
        "client-a",
        availableClients
      )
    ).toBe("client-b");
  });

  it("uses saved client id when URL is missing", () => {
    expect(
      resolveActiveClientId(
        null,
        defaultClientProfile.id,
        defaultClientProfile.id,
        clientProfiles
      )
    ).toBe(defaultClientProfile.id);
  });
});

describe("db mappers", () => {
  it("formats relative time", () => {
    const now = new Date("2026-06-16T12:00:00.000Z");
    expect(
      formatRelativeTime("2026-06-16T11:50:00.000Z", now)
    ).toBe("10 min ago");
  });

  it("formats appointment date labels", () => {
    const now = new Date("2026-06-16T12:00:00.000Z");
    expect(
      formatAppointmentDateTime("2026-06-16T15:00:00.000Z", now).date
    ).toBe("Today");
  });

  it("maps lead rows with latest AI summary", () => {
    const lead = mapLeadRow({
      id: "lead-1",
      client_id: "client-1",
      full_name: "Ava Williams",
      source: "Instagram Ads",
      neighborhood: "Beverly Grove",
      budget: "$1.4M - $1.8M",
      status: "Hot",
      score: 96,
      next_action: "Call today",
      updated_at: "2026-06-16T11:50:00.000Z",
      ai_calls: [
        {
          summary: "Older summary",
          created_at: "2026-06-15T11:50:00.000Z"
        },
        {
          summary: "Latest summary",
          created_at: "2026-06-16T11:50:00.000Z"
        }
      ]
    });

    expect(lead.name).toBe("Ava Williams");
    expect(lead.aiSummary).toBe("Latest summary");
  });

  it("maps appointment and metric rows", () => {
    const appointment = mapAppointmentRow({
      id: "appt-1",
      client_id: "client-1",
      appointment_type: "Buyer consult",
      starts_at: "2026-06-16T15:00:00.000Z",
      status: "Confirmed",
      leads: { full_name: "Marcus Lee" }
    });

    const metric = mapCampaignMetricRow({
      client_id: "client-1",
      metric_date: "2026-06-16",
      leads: 12,
      booked: 3,
      spend: "160"
    });

    expect(appointment.client).toBe("Marcus Lee");
    expect(appointment.status).toBe("Confirmed");
    expect(formatMetricDay("2026-06-16")).toBe("Tue");
    expect(metric.leads).toBe(12);
    expect(metric.spend).toBe(160);
  });
});
