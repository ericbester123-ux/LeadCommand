create type lead_status as enum (
  'New',
  'AI Contacted',
  'Hot',
  'Booked',
  'Needs Agent'
);

create table agents (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  brokerage text,
  role text not null default 'agent',
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  ghl_contact_id text unique,
  full_name text not null,
  phone text,
  email text,
  source text not null,
  neighborhood text,
  budget text,
  status lead_status not null default 'New',
  score integer not null default 0,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ai_calls (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  retell_call_id text unique,
  outcome text not null,
  summary text not null,
  transcript text,
  sentiment text,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  ghl_calendar_event_id text unique,
  appointment_type text not null,
  starts_at timestamptz not null,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

create table campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  metric_date date not null,
  source text not null,
  leads integer not null default 0,
  booked integer not null default 0,
  spend numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  status text not null default 'Needs Setup',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
