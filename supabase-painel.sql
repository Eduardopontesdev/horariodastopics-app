-- PAINEL DE ACESSOS (painel.html). Rode DEPOIS do supabase.sql.
-- 1) Authentication > Users > Add user > Create new user: crie o seu usuário (e-mail e senha) e marque "Auto Confirm User".
-- 2) Troque SEU-EMAIL@exemplo.com pelo e-mail desse usuário e rode tudo no SQL Editor.
create table if not exists public.topics_admins (email text primary key);
alter table public.topics_admins enable row level security;   -- sem política: ninguém lê pelo navegador
insert into public.topics_admins values ('eduardopontesdev@gmail.com') on conflict do nothing;

create or replace function public.topics_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.topics_admins where email = (auth.jwt() ->> 'email'));
$$;

create or replace function public.topics_painel(dias int default 30) returns json
language plpgsql security definer set search_path = public as $$
declare desde timestamptz := now() - make_interval(days => greatest(dias,1));
begin
  if not public.topics_is_admin() then raise exception 'acesso negado' using errcode = '42501'; end if;
  return json_build_object(
   'totais',(select json_build_object('visitas',count(*) filter (where tipo='visita'),'views',count(*) filter (where tipo='view'),
      'cliques',count(*) filter (where tipo='clique'),'compartilhamentos',count(*) filter (where tipo='compartilhar'),'visitantes',count(distinct uid))
      from public.topics_acessos where criado_em >= desde),
   'por_dia',(select coalesce(json_agg(x order by x.dia),'[]'::json) from (
      select (criado_em at time zone 'America/Fortaleza')::date as dia, count(*) filter (where tipo='visita') as visitas,
             count(*) filter (where tipo='view') as views, count(*) filter (where tipo='clique') as cliques
      from public.topics_acessos where criado_em >= desde group by 1) x),
   'paginas',(select coalesce(json_agg(x order by x.views desc),'[]'::json) from (
      select pagina, count(*) as views from public.topics_acessos where tipo='view' and criado_em >= desde group by pagina order by 2 desc limit 30) x),
   'anuncios',(select coalesce(json_agg(x order by x.cliques desc),'[]'::json) from (
      select pagina, count(*) as cliques from public.topics_acessos where tipo='clique' and criado_em >= desde group by pagina) x),
   'compartilhados',(select coalesce(json_agg(x order by x.total desc),'[]'::json) from (
      select pagina, count(*) as total from public.topics_acessos where tipo='compartilhar' and criado_em >= desde group by pagina limit 20) x));
end $$;

create or replace function public.topics_eventos(limite int default 200) returns json
language plpgsql security definer set search_path = public as $$
begin
  if not public.topics_is_admin() then raise exception 'acesso negado' using errcode = '42501'; end if;
  return (select coalesce(json_agg(x order by x.criado_em desc),'[]'::json) from (
    select criado_em, tipo, pagina, left(uid,8) as uid from public.topics_acessos
    order by criado_em desc limit least(greatest(limite,1),1000)) x);
end $$;

-- só usuário logado pode chamar (o visitante comum, não)
revoke all on function public.topics_is_admin() from public, anon;
revoke all on function public.topics_painel(int) from public, anon;
revoke all on function public.topics_eventos(int) from public, anon;
grant execute on function public.topics_is_admin() to authenticated;
grant execute on function public.topics_painel(int) to authenticated;
grant execute on function public.topics_eventos(int) to authenticated;
