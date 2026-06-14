import type { LucideIcon } from "lucide-react";
import { Bot, CalendarCheck, Database, Megaphone, Workflow } from "lucide-react";

export type IntegrationStatus = "Connected" | "Needs Setup" | "Optional";

export type Integration = {
  adminNote: string;
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
    adminNote:
      "Connect GHL first. LeadCommand should read lead, pipeline, appointment, and workflow outcomes from GHL instead of replacing the CRM.",
    slug: "gohighlevel",
    status: "Connected",
    icon: Workflow,
    fields: ["Location ID", "API Key", "Webhook URL", "Pipeline ID", "Calendar ID"]
  },
  {
    name: "Retell AI",
    description:
      "Optional direct connection for raw call events. Most setups can keep Retell managed through GHL.",
    adminNote:
      "Retell is optional here if calls are already triggered and logged through GHL. Use Direct Retell API only when LeadCommand needs raw Retell webhooks or transcript data.",
    slug: "retell-ai",
    status: "Optional",
    icon: Bot,
    fields: ["Connection Mode", "API Key", "Agent ID", "Inbound Webhook URL"]
  },
  {
    name: "Meta Ads",
    description:
      "Facebook and Instagram campaign source for lead volume, spend, and reporting.",
    adminNote:
      "Meta can stay connected through GHL lead forms at first. Add direct Meta settings later for richer campaign reporting.",
    slug: "meta-ads",
    status: "Needs Setup",
    icon: Megaphone,
    fields: ["Ad Account ID", "Access Token", "Lead Form ID", "Campaign Label"]
  },
  {
    name: "Supabase",
    description:
      "Authentication, admin roles, client access, and LeadCommand reporting database.",
    adminNote:
      "Use Supabase for LeadCommand users, admin roles, reporting snapshots, and integration status records.",
    slug: "supabase",
    status: "Connected",
    icon: Database,
    fields: ["Project URL", "Anon Key", "Service Role Key", "Database URL"]
  },
  {
    name: "Calendar Sync",
    description:
      "Appointment sync from GHL calendars into the client dashboard.",
    adminNote:
      "Calendar sync should normally use the GHL calendar ID, so appointments stay managed inside the CRM.",
    slug: "calendar-sync",
    status: "Optional",
    icon: CalendarCheck,
    fields: ["Calendar ID", "Booking Status Field", "Timezone", "Reminder Workflow ID"]
  }
];
