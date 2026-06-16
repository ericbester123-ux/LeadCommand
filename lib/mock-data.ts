import type { Appointment, CampaignMetric, Lead } from "@/lib/types";
import { defaultClientProfile } from "@/lib/clients";

const mockClientId = defaultClientProfile.id;
const presentationDemoClientId = "client-demo";

export const mockLeads: Lead[] = [
  {
    clientId: presentationDemoClientId,
    id: "LC-2088",
    name: "Megan Foster",
    source: "Facebook Lead Form",
    neighborhood: "Atlantic Seaboard",
    budget: "R4.5M - R6.2M",
    status: "Hot",
    score: 94,
    lastContact: "4 min ago",
    aiSummary:
      "AI confirmed she is actively looking for a family home, has finance pre-approval, and wants to view this week.",
    nextAction: "Send two viewing options today"
  },
  {
    clientId: presentationDemoClientId,
    id: "LC-2087",
    name: "Johan van der Merwe",
    source: "Facebook Lead Form",
    neighborhood: "Constantia",
    budget: "R7M+",
    status: "Booked",
    score: 91,
    lastContact: "18 min ago",
    aiSummary:
      "Seller enquiry qualified. AI captured property details, reason for selling, timeline, and booked a valuation call.",
    nextAction: "Prepare valuation notes"
  },
  {
    clientId: presentationDemoClientId,
    id: "LC-2086",
    name: "Nadia Petersen",
    source: "Instagram Ads",
    neighborhood: "Claremont",
    budget: "R2.8M - R3.4M",
    status: "Needs Agent",
    score: 84,
    lastContact: "41 min ago",
    aiSummary:
      "Interested buyer asked detailed questions about schools and transfer costs. Wants a staff member to confirm options.",
    nextAction: "Call to confirm viewing preferences"
  },
  {
    clientId: presentationDemoClientId,
    id: "LC-2085",
    name: "Thabo Mokoena",
    source: "Facebook Lead Form",
    neighborhood: "Ballito",
    budget: "R3M - R4M",
    status: "AI Contacted",
    score: 76,
    lastContact: "1 hr ago",
    aiSummary:
      "AI reached the lead, confirmed buying timeline, and sent available consultation slots for this week.",
    nextAction: "Monitor for calendar selection"
  },
  {
    clientId: presentationDemoClientId,
    id: "LC-2084",
    name: "Sarah Jacobs",
    source: "Instagram Ads",
    neighborhood: "Somerset West",
    budget: "R2.2M - R2.8M",
    status: "New",
    score: 69,
    lastContact: "12 min ago",
    aiSummary:
      "New enquiry captured from Meta campaign. AI call queued for instant qualification.",
    nextAction: "AI caller queued"
  },
  {
    clientId: mockClientId,
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
  }
];

export const mockAppointments: Appointment[] = [
  {
    clientId: presentationDemoClientId,
    id: "APT-410",
    client: "Johan van der Merwe",
    date: "Today",
    time: "2:30 PM",
    type: "Seller valuation call",
    status: "Confirmed"
  },
  {
    clientId: presentationDemoClientId,
    id: "APT-411",
    client: "Megan Foster",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "Buyer consultation",
    status: "Pending"
  },
  {
    clientId: mockClientId,
    id: "APT-220",
    client: "Marcus Lee",
    date: "Today",
    time: "3:00 PM",
    type: "Buyer consult",
    status: "Confirmed"
  }
];

export const mockCampaignMetrics: CampaignMetric[] = [
  { clientId: presentationDemoClientId, name: "Mon", leads: 14, booked: 2, spend: 520 },
  { clientId: presentationDemoClientId, name: "Tue", leads: 19, booked: 4, spend: 680 },
  { clientId: presentationDemoClientId, name: "Wed", leads: 23, booked: 5, spend: 740 },
  { clientId: presentationDemoClientId, name: "Thu", leads: 31, booked: 8, spend: 890 },
  { clientId: presentationDemoClientId, name: "Fri", leads: 28, booked: 7, spend: 830 },
  { clientId: presentationDemoClientId, name: "Sat", leads: 36, booked: 10, spend: 960 },
  { clientId: presentationDemoClientId, name: "Sun", leads: 25, booked: 6, spend: 790 },
  { clientId: mockClientId, name: "Mon", leads: 18, booked: 4, spend: 220 },
  { clientId: mockClientId, name: "Tue", leads: 24, booked: 6, spend: 260 },
  { clientId: mockClientId, name: "Wed", leads: 21, booked: 5, spend: 245 },
  { clientId: mockClientId, name: "Thu", leads: 32, booked: 9, spend: 330 },
  { clientId: mockClientId, name: "Fri", leads: 27, booked: 7, spend: 305 },
  { clientId: mockClientId, name: "Sat", leads: 36, booked: 11, spend: 360 },
  { clientId: mockClientId, name: "Sun", leads: 29, booked: 8, spend: 310 }
];

export function getMockClientData(clientId: string) {
  return {
    appointments: mockAppointments.filter(
      (appointment) => appointment.clientId === clientId
    ),
    campaignMetrics: mockCampaignMetrics.filter(
      (metric) => metric.clientId === clientId
    ),
    leads: mockLeads.filter((lead) => lead.clientId === clientId)
  };
}
