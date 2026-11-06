-- Artist Factory: configuração inicial do projecto central.
-- Executar no SQL Editor do projecto Supabase Artist Factory.
create table if not exists public.factory_owner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Factory Owner',
  created_at timestamptz not null default now()
);
alter table public.factory_owner_profiles enable row level security;
drop policy if exists "Owner reads own profile" on public.factory_owner_profiles;
create policy "Owner reads own profile" on public.factory_owner_profiles for select to authenticated using (user_id = auth.uid());
revoke all on public.factory_owner_profiles from anon;
grant select on public.factory_owner_profiles to authenticated;
-- Após criar o utilizador em Authentication > Users, registar o UUID:
-- insert into public.factory_owner_profiles (user_id, display_name) values ('UUID_DO_OWNER', 'Factory Owner');