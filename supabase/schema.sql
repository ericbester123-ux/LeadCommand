create type agent_role as enum ('admin', 'agent');

create type lead_status as enum (
  'New',
  'AI Contacted',
  'Hot',
  'Booked',
  'Needs Agent'
);

create type integration_status as enum (
  'connected',
  'needs_setup',
  'optional',
  'configured',
  'error'
);

create table agents (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  brokerage text,
  role agent_role not null default 'agent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brokerage text,
  location_name text not null,
  ghl_location_id text,
  market text,
  status text not null default 'Needs Setup',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table client_memberships (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  role agent_role not null default 'agent',
  created_at timestamptz not null default now(),
  unique (client_id, agent_id)
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
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
  ghl_contact_id text,
  outcome text not null,
  summary text not null,
  transcript text,
  sentiment text,
  duration_seconds integer,
  recording_url text,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  ghl_calendar_event_id text unique,
  ghl_calendar_id text,
  appointment_type text not null,
  starts_at timestamptz not null,
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  metric_date date not null,
  source text not null,
  campaign_id text,
  campaign_name text,
  leads integer not null default 0,
  booked integer not null default 0,
  spend numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table integrations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  provider text not null,
  status integration_status not null default 'needs_setup',
  connection_mode text,
  webhook_url text,
  last_tested_at timestamptz,
  last_test_result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table integration_credentials (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid not null references integrations(id) on delete cascade,
  field_key text not null,
  field_label text not null,
  field_value text,
  is_secret boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (integration_id, field_key)
);

insert into integrations (slug, name, provider, status, connection_mode)
values
  ('gohighlevel', 'GoHighLevel', 'gohighlevel', 'needs_setup', 'Private Integration'),
  ('retell-ai', 'Retell AI', 'retell', 'optional', 'GHL Managed'),
  ('meta-ads', 'Meta Ads', 'meta', 'needs_setup', 'GHL Lead Forms'),
  ('supabase', 'Supabase', 'supabase', 'connected', 'Native'),
  ('calendar-sync', 'Calendar Sync', 'gohighlevel', 'optional', 'GHL Calendar')
on conflict (slug) do nothing;
