-- Big O Drill · migration 3: leaderboard
--
-- Public top 10: each player's best finished, unflagged run that scored above 0.
-- Players are shown by their full Google display name (profiles.display_name).
-- Player ids never leave the database; `is_me` marks the caller's own row.
--
-- Abandoned runs are finished lazily by start_run, so a run left open counts
-- once anyone starts a new run (or after its owner starts their next one).

create function public.leaderboard()
returns table (
  rank         integer,
  display_name text,
  score        integer,
  correct      integer,
  answered     integer,
  lang         text,
  finished_at  timestamptz,
  is_me        boolean
)
language sql stable security definer set search_path = ''
as $$
  with best as (
    select distinct on (r.user_id)
           r.user_id, r.score, r.correct, r.answered, r.lang, r.finished_at
    from public.runs r
    where r.status = 'finished' and not r.flagged and r.score > 0
    order by r.user_id, r.score desc, r.finished_at asc
  ),
  ranked as (
    select b.*, rank() over (order by b.score desc)::integer as place
    from best b
  )
  select x.place, p.display_name, x.score, x.correct, x.answered, x.lang, x.finished_at,
         coalesce(x.user_id = auth.uid(), false)
  from ranked x
  join public.profiles p on p.id = x.user_id
  order by x.score desc, x.finished_at asc
  limit 10
$$;

-- The caller's best counted run and where it ranks among all players, or null.
create function public.my_best()
returns jsonb
language sql stable security definer set search_path = ''
as $$
  with counted as (
    select r.user_id, r.score, r.correct, r.answered, r.lang, r.finished_at
    from public.runs r
    where r.status = 'finished' and not r.flagged and r.score > 0
  ),
  mine as (
    select * from counted
    where user_id = auth.uid()
    order by score desc, finished_at asc
    limit 1
  ),
  bests as (
    select max(score) as score from counted group by user_id
  )
  select jsonb_build_object(
           'rank', 1 + (select count(*) from bests b where b.score > m.score),
           'score', m.score,
           'correct', m.correct,
           'answered', m.answered,
           'lang', m.lang,
           'finished_at', m.finished_at)
  from mine m
$$;

revoke execute on function public.leaderboard(), public.my_best() from public, anon, authenticated;
grant execute on function public.leaderboard() to anon, authenticated;
grant execute on function public.my_best() to authenticated;
