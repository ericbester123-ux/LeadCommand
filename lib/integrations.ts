import type { LucideIcon } from "lucide-react";
import { Bot, CalendarCheck, Database, Megaphone, Workflow } from "lucide-react";

export type IntegrationStatus = "Connected" | "Needs Setup" | "Optional";

export type Integration = {
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: LucideIcon;
};

export const integrations: Integration[] = [
  {
    name: "GoHighLevel",
    description:
      "CRM backend for contacts, forms, pipelines, calendars, SMS, email, and workflows.",
    status: "Connected",
    icon: Workflow
  },
  {
    name: "Retell AI",
    description:
      "AI caller used for lead qualification, call summaries, transcripts, and booking intent.",
    status: "Needs Setup",
    icon: Bot
  },
  {
    name: "Meta Ads",
    description:
      "Facebook and Instagram campaign source for lead volume, spend, and reporting.",
    status: "Needs Setup",
    icon: Megaphone
  },
  {
    name: "Supabase",
    description:
      "Authentication, admin roles, client access, and LeadCommand reporting database.",
    status: "Connected",
    icon: Database
  },
  {
    name: "Calendar Sync",
    description:
      "Appointment sync from GHL calendars into the client dashboard.",
    status: "Optional",
    icon: CalendarCheck
  }
];
