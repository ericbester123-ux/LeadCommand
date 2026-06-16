-- Keep only the Eric Trst location and remove demo/test locations.
-- Run once in the Supabase SQL Editor.

delete from clients
where not (
  location_name = 'Eric Trst'
  or name = 'Eric Trst'
);

insert into clients (name, brokerage, location_name, ghl_location_id, market, status)
select 'Eric Trst', 'Estates Elevate', 'Eric Trst', null, null, 'Needs Setup'
where not exists (
  select 1
  from clients
  where location_name = 'Eric Trst'
     or name = 'Eric Trst'
);
