-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  role text check (role in ('vendor','company','organiser')),
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

do $$ begin
  create policy "profiles_select_all"
    on public.profiles for select
    using (true);
exception when others then null; end $$;

do $$ begin
  create policy "profiles_upsert_own"
    on public.profiles for insert
    with check (id = auth.uid());
exception when others then null; end $$;

do $$ begin
  create policy "profiles_update_own"
    on public.profiles for update
    using (id = auth.uid());
exception when others then null; end $$;

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organiser_id uuid,
  name text not null,
  event_date date not null,
  location text not null,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.events enable row level security;

do $$ begin
  create policy "events_select_all"
    on public.events for select
    using (true);
exception when others then null; end $$;

do $$ begin
  create policy "events_insert_authenticated"
    on public.events for insert
    with check (auth.role() = 'authenticated');
exception when others then null; end $$;

do $$ begin
  create policy "events_update_own"
    on public.events for update
    using (organiser_id = auth.uid());
exception when others then null; end $$;

do $$ begin
  create policy "events_delete_own"
    on public.events for delete
    using (organiser_id = auth.uid());
exception when others then null; end $$;

-- Event Positions
create table if not exists public.event_positions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default now()
);

alter table public.event_positions enable row level security;

do $$ begin
  create policy "positions_select_all"
    on public.event_positions for select
    using (true);
exception when others then null; end $$;

do $$ begin
  create policy "positions_insert_authenticated"
    on public.event_positions for insert
    with check (auth.role() = 'authenticated');
exception when others then null; end $$;

do $$ begin
  create policy "positions_update_own_event"
    on public.event_positions for update
    using (exists (select 1 from public.events e where e.id = event_id and e.organiser_id = auth.uid()));
exception when others then null; end $$;

do $$ begin
  create policy "positions_delete_own_event"
    on public.event_positions for delete
    using (exists (select 1 from public.events e where e.id = event_id and e.organiser_id = auth.uid()));
exception when others then null; end $$;


