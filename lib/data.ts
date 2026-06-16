import type { Appointment, CampaignMetric, Lead } from "@/lib/types";
import { defaultClientProfile } from "@/lib/clients";

export const unassignedClientId = "__unassigned__";

export const leads: Lead[] = [
  {
    clientId: "client-estates-demo",
    id: "LC-1048",
    name: "Ava Williams",
    source: "Instagram Ads",
    neighborhood: "Beverly Grove",
    budget: "$1.4M - $1.8M",
    status: "Hot",
    score: 96,
    lastContact: "8 min ago",
    aiSummary:
      "Wants a 3-bed home near good schools. Ready to view this weekend and asked about pre-approval next steps.",
    nextAction: "Call today with two viewing options"
  },
  {
    clientId: "client-estates-demo",
    id: "LC-1047",
    name: "Marcus Lee",
    source: "Facebook Lead Form",
    neighborhood: "Santa Monica",
    budget: "$900K - $1.2M",
    status: "Booked",
    score: 88,
    lastContact: "32 min ago",
    aiSummary:
      "Retell qualified timeline, budget, and preferred area. Appointment booked for buyer consultation.",
    nextAction: "Prepare consult notes"
  },
  {
    clientId: "client-estates-demo",
    id: "LC-1046",
    name: "Priya Shah",
    source: "Instagram Ads",
    neighborhood: "Pasadena",
    budget: "$750K - $950K",
    status: "Needs Agent",
    score: 81,
    lastContact: "1 hr ago",
    aiSummary:
      "Asked detailed questions about HOA fees and wants a human follow-up before sharing availability.",
    nextAction: "Answer HOA concern"
  },
  {
    clientId: "client-westside",
    id: "LC-1045",
    name: "Daniel Brooks",
    source: "Facebook Lead Form",
    neighborhood: "Culver City",
    budget: "$1.1M - $1.5M",
    status: "AI Contacted",
    score: 72,
    lastContact: "2 hrs ago",
    aiSummary:
      "Interested but still comparing neighborhoods. AI sent calendar link and captured property preferences.",
    nextAction: "Monitor for booking"
  },
  {
    clientId: "client-westside",
    id: "LC-1044",
    name: "Sofia Ramirez",
    source: "Referral Form",
    neighborhood: "Silver Lake",
    budget: "$1.8M+",
    status: "New",
    score: 68,
    lastContact: "4 hrs ago",
    aiSummary:
      "New seller lead requested valuation for a hillside property. No call outcome yet.",
    nextAction: "AI caller queued"
  }
];

export const appointments: Appointment[] = [
  {
    clientId: "client-estates-demo",
    id: "APT-220",
    client: "Marcus Lee",
    date: "Today",
    time: "3:00 PM",
    type: "Buyer consult",
    status: "Confirmed"
  },
  {
    clientId: "client-estates-demo",
    id: "APT-221",
    client: "Ava Williams",
    date: "Tomorrow",
    time: "11:30 AM",
    type: "Property tour",
    status: "Pending"
  },
  {
    clientId: "client-westside",
    id: "APT-222",
    client: "Sofia Ramirez",
    date: "Friday",
    time: "9:00 AM",
    type: "Listing valuation",
    status: "Pending"
  }
];

export const campaignMetrics: CampaignMetric[] = [
  { clientId: "client-estates-demo", name: "Mon", leads: 18, booked: 4, spend: 220 },
  { clientId: "client-estates-demo", name: "Tue", leads: 24, booked: 6, spend: 260 },
  { clientId: "client-estates-demo", name: "Wed", leads: 21, booked: 5, spend: 245 },
  { clientId: "client-estates-demo", name: "Thu", leads: 32, booked: 9, spend: 330 },
  { clientId: "client-estates-demo", name: "Fri", leads: 27, booked: 7, spend: 305 },
  { clientId: "client-estates-demo", name: "Sat", leads: 36, booked: 11, spend: 360 },
  { clientId: "client-estates-demo", name: "Sun", leads: 29, booked: 8, spend: 310 },
  { clientId: "client-westside", name: "Mon", leads: 6, booked: 1, spend: 90 },
  { clientId: "client-westside", name: "Tue", leads: 9, booked: 2, spend: 120 },
  { clientId: "client-westside", name: "Wed", leads: 7, booked: 1, spend: 110 },
  { clientId: "client-westside", name: "Thu", leads: 12, booked: 3, spend: 160 },
  { clientId: "client-westside", name: "Fri", leads: 10, booked: 2, spend: 145 },
  { clientId: "client-westside", name: "Sat", leads: 14, booked: 4, spend: 180 },
  { clientId: "client-westside", name: "Sun", leads: 8, booked: 1, spend: 130 }
];

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

export function getClientData(clientId: string) {
  return {
    appointments: appointments.filter(
      (appointment) => appointment.clientId === clientId
    ),
    campaignMetrics: campaignMetrics.filter(
      (metric) => metric.clientId === clientId
    ),
    leads: leads.filter((lead) => lead.clientId === clientId)
  };
}
