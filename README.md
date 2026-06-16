# LeadCommand

LeadCommand is an MVP dashboard layer for Estates Elevate real estate agents.
It is designed to sit above GoHighLevel, not replace it.

## System Roles

- GoHighLevel: CRM/backend for contacts, pipelines, forms, calendars, workflows, SMS, email, and automations.
- Retell AI: AI caller and call outcome source.
- Facebook/Instagram Ads: lead source.
- LeadCommand: client-facing command center for leads, AI calls, appointments, and reporting.

## Tech Stack

- Next.js
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Recharts
- TanStack Table
- Vercel-ready project structure

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the app:

```bash
npm run dev
```

## Data Model

Use `supabase/schema.sql` as the starting point for the Supabase PostgreSQL tables.
The current MVP uses local sample data so the dashboard can be reviewed before integrations are connected.
