import type { Appointment, CampaignMetric, Lead } from "@/lib/types";

export const leads: Lead[] = [
  {
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
    id: "APT-220",
    client: "Marcus Lee",
    date: "Today",
    time: "3:00 PM",
    type: "Buyer consult",
    status: "Confirmed"
  },
  {
    id: "APT-221",
    client: "Ava Williams",
    date: "Tomorrow",
    time: "11:30 AM",
    type: "Property tour",
    status: "Pending"
  },
  {
    id: "APT-222",
    client: "Sofia Ramirez",
    date: "Friday",
    time: "9:00 AM",
    type: "Listing valuation",
    status: "Pending"
  }
];

export const campaignMetrics: CampaignMetric[] = [
  { name: "Mon", leads: 18, booked: 4, spend: 220 },
  { name: "Tue", leads: 24, booked: 6, spend: 260 },
  { name: "Wed", leads: 21, booked: 5, spend: 245 },
  { name: "Thu", leads: 32, booked: 9, spend: 330 },
  { name: "Fri", leads: 27, booked: 7, spend: 305 },
  { name: "Sat", leads: 36, booked: 11, spend: 360 },
  { name: "Sun", leads: 29, booked: 8, spend: 310 }
];
