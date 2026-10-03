-- Run once in Supabase SQL Editor for Sunrise duty V2.
create table if not exists public.duty_settings (id integer primary key check (id=1),anchor_week date not null,rotation_groups jsonb not null default '[]'::jsonb,updated_at timestamptz not null default now());
create table if not exists public.duty_week_overrides (week_start date primary key,member_ids jsonb not null default '[]'::jsonb,updated_at timestamptz not null default now());
alter table public.duty_settings enable row level security;
alter table public.duty_week_overrides enable row level security;
drop policy if exists "duty settings public read" on public.duty_settings;
drop policy if exists "duty overrides public read" on public.duty_week_overrides;
drop policy if exists "duty settings admin r4 write" on public.duty_settings;
drop policy if exists "duty overrides admin r4 write" on public.duty_week_overrides;
create policy "duty settings public read" on public.duty_settings for select using (true);
create policy "duty overrides public read" on public.duty_week_overrides for select using (true);
create policy "duty settings admin r4 write" on public.duty_settings for all to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and lower(p.role) in ('admin','r4'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and lower(p.role) in ('admin','r4')));
create policy "duty overrides admin r4 write" on public.duty_week_overrides for all to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and lower(p.role) in ('admin','r4'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and lower(p.role) in ('admin','r4')));
insert into public.duty_settings(id,anchor_week,rotation_groups) values(1,current_date,'[]'::jsonb) on conflict(id) do nothing;