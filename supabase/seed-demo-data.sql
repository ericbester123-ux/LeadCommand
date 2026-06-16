-- Seed demo dashboard data for the Eric Trst location.
-- Safe to re-run: skips rows that already exist.

do $$
declare
  v_client_id uuid;
  v_lead_ava uuid;
  v_lead_marcus uuid;
  v_lead_priya uuid;
  v_lead_daniel uuid;
  v_lead_sofia uuid;
begin
  select id
  into v_client_id
  from public.clients
  where location_name = 'Eric Trst'
     or name = 'Eric Trst'
  order by created_at asc
  limit 1;

  if v_client_id is null then
    insert into public.clients (name, brokerage, location_name, market, status)
    values ('Eric Trst', 'Estates Elevate', 'Eric Trst', 'Los Angeles', 'Connected')
    returning id into v_client_id;
  end if;

  insert into public.leads (
    client_id,
    full_name,
    source,
    neighborhood,
    budget,
    status,
    score,
    next_action
  )
  select v_client_id, seed.full_name, seed.source, seed.neighborhood, seed.budget, seed.status, seed.score, seed.next_action
  from (
    values
      ('Ava Williams', 'Instagram Ads', 'Beverly Grove', '$1.4M - $1.8M', 'Hot'::lead_status, 96, 'Call today with two viewing options'),
      ('Marcus Lee', 'Facebook Lead Form', 'Santa Monica', '$900K - $1.2M', 'Booked'::lead_status, 88, 'Prepare consult notes'),
      ('Priya Shah', 'Instagram Ads', 'Pasadena', '$750K - $950K', 'Needs Agent'::lead_status, 81, 'Answer HOA concern'),
      ('Daniel Brooks', 'Facebook Lead Form', 'Culver City', '$1.1M - $1.5M', 'AI Contacted'::lead_status, 72, 'Monitor for booking'),
      ('Sofia Ramirez', 'Referral Form', 'Silver Lake', '$1.8M+', 'New'::lead_status, 68, 'AI caller queued')
  ) as seed(full_name, source, neighborhood, budget, status, score, next_action)
  where not exists (
    select 1
    from public.leads existing
    where existing.client_id = v_client_id
      and existing.full_name = seed.full_name
  );

  select id into v_lead_ava from public.leads where client_id = v_client_id and full_name = 'Ava Williams' limit 1;
  select id into v_lead_marcus from public.leads where client_id = v_client_id and full_name = 'Marcus Lee' limit 1;
  select id into v_lead_priya from public.leads where client_id = v_client_id and full_name = 'Priya Shah' limit 1;
  select id into v_lead_daniel from public.leads where client_id = v_client_id and full_name = 'Daniel Brooks' limit 1;
  select id into v_lead_sofia from public.leads where client_id = v_client_id and full_name = 'Sofia Ramirez' limit 1;

  insert into public.ai_calls (lead_id, outcome, summary)
  select v_lead_ava, 'completed', 'Wants a 3-bed home near good schools. Ready to view this weekend and asked about pre-approval next steps.'
  where v_lead_ava is not null
    and not exists (select 1 from public.ai_calls where lead_id = v_lead_ava);

  insert into public.ai_calls (lead_id, outcome, summary)
  select v_lead_marcus, 'booked', 'Retell qualified timeline, budget, and preferred area. Appointment booked for buyer consultation.'
  where v_lead_marcus is not null
    and not exists (select 1 from public.ai_calls where lead_id = v_lead_marcus);

  insert into public.ai_calls (lead_id, outcome, summary)
  select v_lead_priya, 'needs_agent', 'Asked detailed questions about HOA fees and wants a human follow-up before sharing availability.'
  where v_lead_priya is not null
    and not exists (select 1 from public.ai_calls where lead_id = v_lead_priya);

  insert into public.ai_calls (lead_id, outcome, summary)
  select v_lead_daniel, 'completed', 'Interested but still comparing neighborhoods. AI sent calendar link and captured property preferences.'
  where v_lead_daniel is not null
    and not exists (select 1 from public.ai_calls where lead_id = v_lead_daniel);

  insert into public.appointments (client_id, lead_id, appointment_type, starts_at, status)
  select
    v_client_id,
    v_lead_marcus,
    'Buyer consult',
    date_trunc('day', now()) + interval '15 hours',
    'Confirmed'
  where v_lead_marcus is not null
    and not exists (
      select 1
      from public.appointments
      where lead_id = v_lead_marcus
        and appointment_type = 'Buyer consult'
    );

  insert into public.appointments (client_id, lead_id, appointment_type, starts_at, status)
  select
    v_client_id,
    v_lead_ava,
    'Property tour',
    date_trunc('day', now()) + interval '1 day 11 hours 30 minutes',
    'Pending'
  where v_lead_ava is not null
    and not exists (
      select 1
      from public.appointments
      where lead_id = v_lead_ava
        and appointment_type = 'Property tour'
    );

  insert into public.appointments (client_id, lead_id, appointment_type, starts_at, status)
  select
    v_client_id,
    v_lead_sofia,
    'Listing valuation',
    date_trunc('day', now()) + interval '3 days 9 hours',
    'Pending'
  where v_lead_sofia is not null
    and not exists (
      select 1
      from public.appointments
      where lead_id = v_lead_sofia
        and appointment_type = 'Listing valuation'
    );

  insert into public.campaign_metrics (client_id, metric_date, source, leads, booked, spend)
  select v_client_id, current_date - offset_days, 'Meta Ads', leads, booked, spend
  from (
    values
      (6, 18, 4, 220.00),
      (5, 24, 6, 260.00),
      (4, 21, 5, 245.00),
      (3, 32, 9, 330.00),
      (2, 27, 7, 305.00),
      (1, 36, 11, 360.00),
      (0, 29, 8, 310.00)
  ) as metric_seed(offset_days, leads, booked, spend)
  where not exists (
    select 1
    from public.campaign_metrics
    where client_id = v_client_id
      and metric_date = current_date - metric_seed.offset_days
  );
end $$;
