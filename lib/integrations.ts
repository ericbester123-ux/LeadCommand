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
      "Primary CRM/backend for contacts, pipelines, forms, calendars, workflows, SMS, and email.",
    adminNote:
      "Connect GHL first. LeadCommand should use GHL as the source of truth for leads, pipeline status, calendar bookings, and automation outcomes.",
    slug: "gohighlevel",
    status: "Needs Setup",
    icon: Workflow,
    fields: [
      "Connection Mode",
      "Location ID",
      "Private Integration Access Token",
      "API Version",
      "Webhook URL",
      "Webhook Secret",
      "Pipeline ID",
      "Calendar ID"
    ]
  },
  {
    name: "Retell AI",
    description:
      "Optional direct connection for raw call events. Most setups can keep Retell managed through GHL.",
    adminNote:
      "If Retell calls are triggered and logged inside GHL, choose GHL Managed. Direct Retell is only needed when LeadCommand must receive raw call webhooks, transcripts, recordings, or call analysis.",
    slug: "retell-ai",
    status: "Optional",
    icon: Bot,
    fields: [
      "Connection Mode",
      "API Key",
      "Agent ID",
      "From Number",
      "Inbound Webhook URL",
      "Webhook Secret"
    ]
  },
  {
    name: "Meta Ads",
    description:
      "Facebook and Instagram campaign source for lead forms, spend, and reporting.",
    adminNote:
      "Meta can stay connected through GHL lead forms first. Direct Meta credentials are only needed for richer spend, campaign, and lead form reporting inside LeadCommand.",
    slug: "meta-ads",
    status: "Needs Setup",
    icon: Megaphone,
    fields: [
      "Connection Mode",
      "Business ID",
      "Ad Account ID",
      "Page ID",
      "Lead Form ID",
      "Access Token",
      "App ID",
      "App Secret",
      "Webhook Verify Token"
    ]
  },
  {
    name: "Supabase",
    description:
      "PostgreSQL database, authentication, admin roles, client access, and integration settings.",
    adminNote:
      "Supabase stores LeadCommand users, admin roles, reporting snapshots, and SQL integration records. Service role keys must only be used server-side.",
    slug: "supabase",
    status: "Connected",
    icon: Database,
    fields: [
      "Project URL",
      "Anon Public Key",
      "Service Role Key",
      "Database URL"
    ]
  },
  {
    name: "Calendar Sync",
    description:
      "Appointment sync from GHL calendars into the client dashboard.",
    adminNote:
      "Calendar sync should normally use the GHL Location ID and Calendar ID so appointment ownership stays inside the CRM.",
    slug: "calendar-sync",
    status: "Optional",
    icon: CalendarCheck,
    fields: [
      "Connection Mode",
      "GHL Location ID",
      "GHL Calendar ID",
      "Timezone",
      "Appointment Status Field",
      "Reminder Workflow ID"
    ]
  }
];
