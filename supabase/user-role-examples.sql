-- LeadCommand user role examples
-- Run these in Supabase SQL Editor only when you need to adjust roles manually.

-- Make a user an admin by email.
update agents
set role = 'admin',
    updated_at = now()
where id = (
  select id
  from auth.users
  where email = 'your-admin-email@example.com'
);

-- Make a user a client/agent by email.
update agents
set role = 'agent',
    updated_at = now()
where id = (
  select id
  from auth.users
  where email = 'client-email@example.com'
);

-- See all LeadCommand app users and roles.
select
  agents.full_name,
  auth.users.email,
  agents.role,
  agents.created_at
from agents
join auth.users on auth.users.id = agents.id
order by agents.created_at desc;
