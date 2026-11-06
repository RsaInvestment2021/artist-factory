-- MODELO: substituir pelos UUIDs reais criados em Supabase Auth > Users.
insert into public.admin_users (user_id, role)
values ('SUBSTITUIR-PELO-UUID-DO-OWNER','owner'),
       ('SUBSTITUIR-PELO-UUID-DO-ARTISTA','artist_admin')
on conflict (user_id) do update set role = excluded.role;
select user_id, role, created_at from public.admin_users order by role;
