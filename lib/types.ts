export type LeadStatus =
  | "New"
  | "AI Contacted"
  | "Hot"
  | "Booked"
  | "Needs Agent";

export type Lead = {
  id: string;
  name: string;
  source: string;
  neighborhood: string;
  budget: string;
  status: LeadStatus;
  score: number;
  lastContact: string;
  aiSummary: string;
  nextAction: string;
};

export type Appointment = {
  id: string;
  client: string;
  date: string;
  time: string;
  type: string;
  status: "Confirmed" | "Pending";
};

export type CampaignMetric = {
  name: string;
  leads: number;
  booked: number;
  spend: number;
};
