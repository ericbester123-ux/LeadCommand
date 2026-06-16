-- LeadCommand database repair script
-- Run in Supabase SQL Editor after schema.sql and rls-policies.sql

-- 1. Remove duplicate demo locations and keep Eric Trst only
delete from public.clients
where not (
  location_name = 'Eric Trst'
  or name = 'Eric Trst'
);

insert into public.clients (name, brokerage, location_name, market, status)
select 'Eric Trst', 'Estates Elevate', 'Eric Trst', 'Los Angeles', 'Needs Setup'
where not exists (
  select 1
  from public.clients
  where location_name = 'Eric Trst'
     or name = 'Eric Trst'
);

-- 2. Helpful indexes for dashboard queries
create index if not exists leads_client_id_updated_at_idx
  on public.leads (client_id, updated_at desc);

create index if not exists appointments_client_id_starts_at_idx
  on public.appointments (client_id, starts_at asc);

create index if not exists campaign_metrics_client_id_metric_date_idx
  on public.campaign_metrics (client_id, metric_date asc);

create index if not exists ai_calls_lead_id_created_at_idx
  on public.ai_calls (lead_id, created_at desc);

-- 3. Run supabase/seed-demo-data.sql next to populate Eric Trst demo dashboard data.
