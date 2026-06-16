-- LeadCommand production Row Level Security policies
-- Run this after the base schema and client-management migration.
--
-- Before running:
-- 1. Make sure your admin Supabase users already have rows in public.agents.
-- 2. Set your internal/admin users to role = 'admin'.
-- 3. Assign each client user to the correct client in public.client_memberships.

create or replace function public.leadcommand_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.agents
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.leadcommand_can_access_client(client_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    public.leadcommand_is_admin()
    or exists (
      select 1
      from public.client_memberships
      where client_id = client_uuid
        and agent_id = auth.uid()
    );
$$;

alter table public.agents enable row level security;
alter table public.clients enable row level security;
alter table public.client_memberships enable row level security;
alter table public.leads enable row level security;
alter table public.ai_calls enable row level security;
alter table public.appointments enable row level security;
alter table public.campaign_metrics enable row level security;
alter table public.integrations enable row level security;
alter table public.integration_credentials enable row level security;

drop policy if exists "Users can view own agent profile" on public.agents;
drop policy if exists "Admins can view all agent profiles" on public.agents;
drop policy if exists "Users can create own agent profile" on public.agents;
drop policy if exists "Admins can manage agent profiles" on public.agents;

create policy "Users can view own agent profile"
on public.agents
for select
to authenticated
using (id = auth.uid());

create policy "Admins can view all agent profiles"
on public.agents
for select
to authenticated
using (public.leadcommand_is_admin());

create policy "Users can create own agent profile"
on public.agents
for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update own agent profile"
on public.agents
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins can manage agent profiles"
on public.agents
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Members can view assigned clients" on public.clients;
drop policy if exists "Admins can manage clients" on public.clients;

create policy "Members can view assigned clients"
on public.clients
for select
to authenticated
using (public.leadcommand_can_access_client(id));

create policy "Admins can manage clients"
on public.clients
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Users can view own memberships" on public.client_memberships;
drop policy if exists "Admins can manage memberships" on public.client_memberships;

create policy "Users can view own memberships"
on public.client_memberships
for select
to authenticated
using (agent_id = auth.uid() or public.leadcommand_is_admin());

create policy "Admins can manage memberships"
on public.client_memberships
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Members can view client leads" on public.leads;
drop policy if exists "Admins can manage leads" on public.leads;

create policy "Members can view client leads"
on public.leads
for select
to authenticated
using (
  public.leadcommand_can_access_client(client_id)
  or agent_id = auth.uid()
);

create policy "Admins can manage leads"
on public.leads
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Members can view lead AI calls" on public.ai_calls;
drop policy if exists "Admins can manage AI calls" on public.ai_calls;

create policy "Members can view lead AI calls"
on public.ai_calls
for select
to authenticated
using (
  exists (
    select 1
    from public.leads
    where leads.id = ai_calls.lead_id
      and (
        public.leadcommand_can_access_client(leads.client_id)
        or leads.agent_id = auth.uid()
      )
  )
);

create policy "Admins can manage AI calls"
on public.ai_calls
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Members can view client appointments" on public.appointments;
drop policy if exists "Admins can manage appointments" on public.appointments;

create policy "Members can view client appointments"
on public.appointments
for select
to authenticated
using (
  public.leadcommand_can_access_client(client_id)
  or exists (
    select 1
    from public.leads
    where leads.id = appointments.lead_id
      and leads.agent_id = auth.uid()
  )
);

create policy "Admins can manage appointments"
on public.appointments
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Members can view client campaign metrics" on public.campaign_metrics;
drop policy if exists "Admins can manage campaign metrics" on public.campaign_metrics;

create policy "Members can view client campaign metrics"
on public.campaign_metrics
for select
to authenticated
using (
  public.leadcommand_can_access_client(client_id)
  or agent_id = auth.uid()
);

create policy "Admins can manage campaign metrics"
on public.campaign_metrics
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Admins can view integrations" on public.integrations;
drop policy if exists "Admins can manage integrations" on public.integrations;

create policy "Admins can view integrations"
on public.integrations
for select
to authenticated
using (public.leadcommand_is_admin());

create policy "Admins can manage integrations"
on public.integrations
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());

drop policy if exists "Admins can view integration credentials" on public.integration_credentials;
drop policy if exists "Admins can manage integration credentials" on public.integration_credentials;

create policy "Admins can view integration credentials"
on public.integration_credentials
for select
to authenticated
using (public.leadcommand_is_admin());

create policy "Admins can manage integration credentials"
on public.integration_credentials
for all
to authenticated
using (public.leadcommand_is_admin())
with check (public.leadcommand_is_admin());
