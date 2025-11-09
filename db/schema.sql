-- NA MÍDIA - DATABASE SCHEMA (Supabase)
-- Compatível com o código atual do MVP

-- Extensões
create extension if not exists pgcrypto;

-- 1) Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  event_type text not null check (event_type in ('Afterparty','Show','Baile','Festival','Outro')),
  is_active boolean not null default true,
  na_midia_present boolean not null default false,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Confirmations
create table if not exists public.confirmations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_name text,
  user_email text,
  user_phone text,
  created_at timestamptz not null default now()
);

-- 3) Coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  event_id uuid not null references public.events(id) on delete cascade,
  confirmation_id uuid not null references public.confirmations(id) on delete cascade,
  discount_percentage int not null default 15,
  is_used boolean not null default false,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_events_is_active on public.events(is_active);
create index if not exists idx_events_start_time on public.events(start_time);
create index if not exists idx_confirmations_event_id on public.confirmations(event_id);
create index if not exists idx_coupons_event_id on public.coupons(event_id);
create index if not exists idx_coupons_code on public.coupons(code);

-- Function: update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_events_updated_at
before update on public.events
for each row execute procedure public.update_updated_at_column();

-- Views úteis (opcional)
create or replace view public.event_confirmations_count as
select e.id as event_id, e.name as event_name, count(c.id) as confirmations_count
from public.events e
left join public.confirmations c on e.id = c.event_id
group by e.id, e.name;

create or replace view public.unused_coupons as
select c.code, e.name as event_name, c.discount_percentage, c.created_at
from public.coupons c
join public.events e on c.event_id = e.id
where c.is_used = false
order by c.created_at desc;

-- Dados de exemplo (opcional)
-- insert into public.events (name, location, description, start_time, end_time, event_type, is_active, na_midia_present)
-- values
-- ('Baile Funk na Praça','Praça da Matriz, Centro','Melhor baile da cidade! DJ convidado e muito som.', now() + interval '2 hours', now() + interval '5 hours','Baile', true, true),
-- ('Afterparty no Boteco do Zé','Rua das Flores, 123','Depois do show, vem pro Boteco!', now() + interval '4 hours', now() + interval '6 hours','Afterparty', true, true);
