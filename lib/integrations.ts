import type { LucideIcon } from "lucide-react";
import { Bot, CalendarCheck, Database, Megaphone, Workflow } from "lucide-react";

export type IntegrationStatus = "Connected" | "Needs Setup" | "Optional";

export type Integration = {
  name: string;
  description: string;
  slug: string;
  status: IntegrationStatus;
  icon: LucideIcon;
  fields: string[];
};

export const integrations: Integration[] = [
  {
    name: "GoHighLevel",
    description:
      "CRM backend for contacts, forms, pipelines, calendars, SMS, email, and workflows.",
    slug: "gohighlevel",
    status: "Connected",
    icon: Workflow,
    fields: ["Location ID", "API Key", "Webhook URL", "Pipeline ID"]
  },
  {
    name: "Retell AI",
    description:
      "AI caller used for lead qualification, call summaries, transcripts, and booking intent.",
    slug: "retell-ai",
    status: "Needs Setup",
    icon: Bot,
    fields: ["API Key", "Agent ID", "Inbound Webhook URL", "Booking Outcome Tag"]
  },
  {
    name: "Meta Ads",
    description:
      "Facebook and Instagram campaign source for lead volume, spend, and reporting.",
    slug: "meta-ads",
    status: "Needs Setup",
    icon: Megaphone,
    fields: ["Ad Account ID", "Access Token", "Lead Form ID", "Campaign Label"]
  },
  {
    name: "Supabase",
    description:
      "Authentication, admin roles, client access, and LeadCommand reporting database.",
    slug: "supabase",
    status: "Connected",
    icon: Database,
    fields: ["Project URL", "Anon Key", "Service Role Key", "Database URL"]
  },
  {
    name: "Calendar Sync",
    description:
      "Appointment sync from GHL calendars into the client dashboard.",
    slug: "calendar-sync",
    status: "Optional",
    icon: CalendarCheck,
    fields: ["Calendar ID", "Booking Status Field", "Timezone", "Reminder Workflow ID"]
  }
];
