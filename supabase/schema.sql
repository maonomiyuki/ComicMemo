create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  concierge_style text not null default 'butler',
  concierge_avatar_key text not null default 'butler_01',
  timezone text not null default 'Asia/Tokyo',
  notification_time text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '新規プロジェクト',
  total_pages int not null default 30,
  deadline date not null,
  start_date date not null default (now()::date),
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists projects_user_id_idx on public.projects(user_id);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  pages_done int not null default 0,
  memo text,
  created_at timestamptz not null default now()
);
create unique index if not exists daily_logs_unique on public.daily_logs(project_id, log_date);
create index if not exists daily_logs_project_idx on public.daily_logs(project_id);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  is_enabled boolean not null default true,
  has_page_progress boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists tasks_project_idx on public.tasks(project_id);

create table if not exists public.task_progress (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  done_pages int not null default 0,
  total_pages int,
  is_checked boolean not null default false,
  updated_at timestamptz not null default now()
);
create unique index if not exists task_progress_unique on public.task_progress(task_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.daily_logs enable row level security;
alter table public.tasks enable row level security;
alter table public.task_progress enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_upsert_own" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "projects_own" on public.projects for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_logs_own" on public.daily_logs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks_own" on public.tasks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "task_progress_own" on public.task_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
