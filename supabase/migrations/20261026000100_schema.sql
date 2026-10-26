-- Big O Drill · migration 1: schema for ranked play
--
-- Tables, row-level security and the profile trigger. The game functions
-- (start_run, submit_answer, end_run, leaderboard) come in a later migration.
-- Clients can't write to any table here; writes will go through those
-- security-definer functions.

-- ─── profiles ───────────────────────────────────────────────────────────────

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  avatar_url   text,
  created_at   timestamptz not null default now()
);

-- One profile per auth user, filled from the Google profile on sign-up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
                  nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
                  'player'), 60),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users who signed in before this migration
insert into public.profiles (id, display_name, avatar_url)
select id,
       left(coalesce(nullif(trim(raw_user_meta_data ->> 'full_name'), ''),
                     nullif(trim(raw_user_meta_data ->> 'name'), ''),
                     'player'), 60),
       raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;

-- ─── reference data ─────────────────────────────────────────────────────────

create table public.complexity_classes (
  id  text primary key,
  ord smallint not null unique
);

insert into public.complexity_classes (id, ord) values
  ('O(1)', 1), ('O(log n)', 2), ('O(√n)', 3), ('O(n)', 4), ('O(n log n)', 5),
  ('O(n²)', 6), ('O(n³)', 7), ('O(2ⁿ)', 8), ('O(n!)', 9);

-- Answer key; synced from snippets/*/meta.json (see supabase/answers.sql).
create table public.snippet_answers (
  snippet_id text primary key check (snippet_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  answer     text not null references public.complexity_classes (id),
  title      text not null check (char_length(title) > 0),
  why        text not null check (char_length(why) > 0),
  updated_at timestamptz not null default now()
);

-- ─── runs ───────────────────────────────────────────────────────────────────

create table public.runs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  lang        text not null check (lang in ('cpp', 'python', 'javascript', 'java')),
  deck        text[] not null check (cardinality(deck) > 0),
  status      text not null default 'active' check (status in ('active', 'finished')),
  score       integer not null default 0 check (score >= 0),
  streak      integer not null default 0 check (streak >= 0),
  best_streak integer not null default 0 check (best_streak >= streak),
  lives       smallint not null default 3 check (lives between 0 and 3),
  answered    integer not null default 0 check (answered >= 0),
  correct     integer not null default 0 check (correct between 0 and answered),
  flagged     boolean not null default false,   -- hidden from the board pending review
  started_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  finished_at timestamptz,
  check ((status = 'finished') = (finished_at is not null))
);

create unique index runs_one_active_per_user on public.runs (user_id) where status = 'active';
create index runs_leaderboard on public.runs (score desc, finished_at)
  where status = 'finished' and not flagged;
create index runs_by_user_recent on public.runs (user_id, started_at desc);

create table public.run_questions (
  run_id      uuid not null references public.runs (id) on delete cascade,
  n           integer not null check (n >= 1),
  snippet_id  text not null references public.snippet_answers (snippet_id),
  options     text[] not null check (cardinality(options) = 4),
  limit_ms    integer not null check (limit_ms > 0),
  issued_at   timestamptz not null default clock_timestamp(),
  choice      text references public.complexity_classes (id),   -- null = timed out / unanswered
  timed_out   boolean,
  answered_at timestamptz,
  gained      integer check (gained >= 0),
  primary key (run_id, n)
);

-- ─── row-level security ─────────────────────────────────────────────────────
-- Reads are limited to your own rows. There are no write policies at all.

alter table public.profiles           enable row level security;
alter table public.complexity_classes enable row level security;
alter table public.snippet_answers    enable row level security;   -- no policies: unreadable by clients
alter table public.runs               enable row level security;
alter table public.run_questions      enable row level security;

create policy "read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "read complexity classes" on public.complexity_classes
  for select to anon, authenticated using (true);

create policy "read own runs" on public.runs
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "read own run questions" on public.run_questions
  for select to authenticated using (
    exists (select 1 from public.runs r where r.id = run_id and r.user_id = (select auth.uid()))
  );

-- Belt and braces on top of RLS: clients get read access only, and none on the answer key.
revoke insert, update, delete, truncate on
  public.profiles, public.complexity_classes, public.snippet_answers,
  public.runs, public.run_questions
from anon, authenticated;
revoke select on public.snippet_answers from anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
