-- Sync auth.users to public.profiles using user_metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'fullName', ''), new.raw_user_meta_data->>'role')
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


