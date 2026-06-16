-- LeadCommand client/location management migration
-- Run this once in Supabase SQL Editor if your project already has the original schema.

create table if not exists clients (
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

create table if not exists client_memberships (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  role agent_role not null default 'agent',
  created_at timestamptz not null default now(),
  unique (client_id, agent_id)
);

alter table leads
  add column if not exists client_id uuid references clients(id) on delete cascade;

alter table appointments
  add column if not exists client_id uuid references clients(id) on delete cascade;

alter table campaign_metrics
  add column if not exists client_id uuid references clients(id) on delete cascade;

insert into clients (name, brokerage, location_name, ghl_location_id, market, status)
values
  ('Estates Elevate Demo', 'Estates Elevate', 'Main Demo Location', 'demo-location', 'Los Angeles', 'Connected'),
  ('Westside Realty Team', 'Westside Realty', 'Buyer Leads - Westside', null, 'Santa Monica', 'Needs Setup'),
  ('Luxury Listings Group', 'Luxury Listings Group', 'Seller Campaigns', null, 'Beverly Hills', 'Needs Setup')
on conflict do nothing;
