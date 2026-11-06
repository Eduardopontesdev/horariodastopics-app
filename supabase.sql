-- EXEMPLO: tabela NOVA só do app das Topics (nome próprio para não misturar com outros projetos no mesmo Supabase). Se você já tem uma tabela, NÃO rode isto:
-- me mande as colunas dela (ou ajuste "cols" no config.js) e adapte a política e a função.
create table if not exists public.topics_acessos (
  id bigint generated always as identity primary key,
  tipo text not null,            -- visita | view | clique | compartilhar
  pagina text,                   -- home, cam-gra, sobre, anuncio-home...
  uid text,                      -- id aleatório do aparelho (não é dado pessoal)
  criado_em timestamptz not null default now()
);
alter table public.topics_acessos enable row level security;
-- o app só pode INSERIR, e apenas tipos conhecidos. Ninguém lê as linhas pelo navegador.
create policy "app pode registrar acesso" on public.topics_acessos
  for insert to anon with check (tipo in ('visita','view','clique','compartilhar'));
-- totais para mostrar no app (visitas = 1 por aparelho por dia; views = telas abertas)
create or replace function public.topics_contagens() returns json
language sql security definer set search_path = public as $$
  select json_build_object(
    'visitas',(select count(*) from public.topics_acessos where tipo='visita'),
    'views',(select count(*) from public.topics_acessos where tipo='view'));
$$;
grant execute on function public.topics_contagens() to anon;
