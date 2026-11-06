-- Artist Factory — executar em cada projecto Supabase novo.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'artist_admin' check (role in ('owner','artist_admin')),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create or replace function public.is_factory_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = auth.uid()); $$;
create or replace function public.is_factory_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = auth.uid() and role = 'owner'); $$;
grant execute on function public.is_factory_admin() to authenticated;
grant execute on function public.is_factory_owner() to authenticated;
drop policy if exists "Admins can read own role" on public.admin_users;
create policy "Admins can read own role" on public.admin_users for select to authenticated using (user_id = auth.uid());
drop policy if exists "Owners can read project admins" on public.admin_users;
create policy "Owners can read project admins" on public.admin_users for select to authenticated using (public.is_factory_owner());
revoke insert, update, delete on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
-- Provisionar utilizadores e papéis através de backend seguro ou manualmente no SQL Editor.
