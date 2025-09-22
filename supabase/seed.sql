-- Sample data (note: these are not linked to actual auth users)
truncate table public.event_positions restart identity cascade;
truncate table public.events restart identity cascade;
truncate table public.profiles restart identity cascade;

-- Sample profiles
insert into public.profiles (id, full_name, role) values
  ('11111111-1111-1111-1111-111111111111', 'Olivia Organiser', 'organiser'),
  ('22222222-2222-2222-2222-222222222222', 'Victor Vendor', 'vendor'),
  ('33333333-3333-3333-3333-333333333333', 'Cora Company', 'company');

-- Sample events
insert into public.events (id, organiser_id, name, event_date, location, notes) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Gala Night', current_date + interval '14 days', 'Grand Hall', 'Black tie'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Food Festival', current_date + interval '30 days', 'City Park', 'Outdoor booths');

insert into public.event_positions (event_id, title, quantity) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Waiter', 10),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Bartender', 4),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Chef', 6),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Cleaner', 8);


