-- Big O Drill · migration 2: ranked runs
--
-- The database owns the deck, the clock and the score. Clients call three RPCs
-- (start_run, submit_answer, end_run). Helpers live in the `private` schema,
-- which the Supabase Data API doesn't expose.
--
-- Scoring rules mirror src/game/engine.ts; tests/db-ranked.test.ts checks parity.
-- Errors use PostgREST's PTxyz codes so the API answers with HTTP status xyz.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ─── rules (mirror src/game/engine.ts) ──────────────────────────────────────

create function private.time_limit(p_answered integer)
returns integer language sql immutable set search_path = ''
as $$ select greatest(7000, 15000 - 500 * p_answered) $$;

create function private.multiplier(p_streak integer)
returns integer language sql immutable set search_path = ''
as $$ select least(4, 1 + p_streak / 4) $$;

-- Same float64 arithmetic as engine.points(); floor(x + 0.5) is Math.round for x >= 0.
create function private.points(p_remaining_ms double precision, p_limit_ms integer, p_streak integer)
returns integer language sql immutable set search_path = ''
as $$
  select floor(
    (100 + (100 * greatest(p_remaining_ms, 0)) / p_limit_ms) * private.multiplier(p_streak) + 0.5
  )::integer
$$;

-- The answer plus three of the five classes nearest to it, cheapest first.
create function private.pick_options(p_answer text)
returns text[] language sql volatile set search_path = ''
as $$
  with target as (select ord from public.complexity_classes where id = p_answer),
  nearest as (
    select c.id
    from public.complexity_classes c, target t
    where c.id <> p_answer
    order by abs(c.ord - t.ord) + random() * 0.5
    limit 5
  ),
  picked as (select id from nearest order by random() limit 3)
  select array_agg(c.id order by c.ord)
  from public.complexity_classes c
  where c.id = p_answer or c.id in (select id from picked)
$$;

create function private.shuffled_deck(p_avoid_first text default null)
returns text[] language plpgsql volatile set search_path = ''
as $$
declare
  d text[];
begin
  select array_agg(snippet_id order by random()) into d from public.snippet_answers;
  if d is null then
    raise exception 'no_snippets_loaded' using errcode = 'PT503';
  end if;
  if p_avoid_first is not null and cardinality(d) > 1 and d[1] = p_avoid_first then
    d := d[2:2] || d[1:1] || d[3:];
  end if;
  return d;
end
$$;

-- Issues question answered+1, reshuffling once the deck is used up.
create function private.issue_question(p_run uuid)
returns jsonb language plpgsql volatile set search_path = ''
as $$
declare
  r public.runs;
  n integer;
  pos integer;
  sid text;
  opts text[];
  lim integer;
begin
  select * into r from public.runs where id = p_run;
  n := r.answered + 1;
  pos := (n - 1) % cardinality(r.deck);
  if pos = 0 and n > 1 then
    r.deck := private.shuffled_deck(r.deck[cardinality(r.deck)]);
    update public.runs set deck = r.deck where id = p_run;
  end if;
  sid := r.deck[pos + 1];
  opts := private.pick_options((select answer from public.snippet_answers where snippet_id = sid));
  lim := private.time_limit(r.answered);

  insert into public.run_questions (run_id, n, snippet_id, options, limit_ms, issued_at)
  values (p_run, n, sid, opts, lim, clock_timestamp());

  return jsonb_build_object('n', n, 'snippet_id', sid, 'options', to_jsonb(opts), 'limit_ms', lim);
end
$$;

-- Finishes an active run and flags it if answers came in faster than a person can read.
create function private.finish_run(p_run uuid)
returns void language sql volatile set search_path = ''
as $$
  update public.runs r
  set status = 'finished', finished_at = now(), updated_at = now(),
      flagged = r.flagged or coalesce((
        select bool_or(q.answered_at - q.issued_at < interval '400 milliseconds')
               or (count(*) >= 5 and avg(q.answered_at - q.issued_at) < interval '1 second')
        from public.run_questions q
        where q.run_id = r.id and q.answered_at is not null and not q.timed_out
      ), false)
  where r.id = p_run and r.status = 'active'
$$;

create function private.expire_stale_runs()
returns void language plpgsql volatile set search_path = ''
as $$
declare
  stale uuid;
begin
  for stale in
    select id from public.runs
    where status = 'active' and updated_at < now() - interval '10 minutes'
    for update skip locked
  loop
    perform private.finish_run(stale);
  end loop;
end
$$;

create function private.final_json(r public.runs)
returns jsonb language sql stable set search_path = ''
as $$
  select jsonb_build_object(
    'score', r.score, 'correct', r.correct, 'answered', r.answered, 'best_streak', r.best_streak)
$$;

-- ─── RPCs ───────────────────────────────────────────────────────────────────

create function public.start_run(p_lang text)
returns jsonb language plpgsql volatile security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  new_run uuid;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = 'PT401';
  end if;
  if p_lang is null or p_lang not in ('cpp', 'python', 'javascript', 'java') then
    raise exception 'invalid_language' using errcode = 'PT400';
  end if;

  -- serialise starts per player
  perform 1 from public.profiles where id = uid for update;
  if not found then
    raise exception 'profile_missing' using errcode = 'PT403';
  end if;

  if (select count(*) from public.runs
      where user_id = uid and started_at > now() - interval '1 hour') >= 30 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  perform private.expire_stale_runs();
  perform private.finish_run(id) from public.runs where user_id = uid and status = 'active';

  insert into public.runs (user_id, lang, deck)
  values (uid, p_lang, private.shuffled_deck())
  returning id into new_run;

  return jsonb_build_object(
    'run_id', new_run,
    'score', 0,
    'streak', 0,
    'lives', 3,
    'question', private.issue_question(new_run)
  );
end
$$;

-- p_choice null means the client's timer ran out. Answering the same question
-- again returns the recorded result without scoring twice.
create function public.submit_answer(p_run uuid, p_n integer, p_choice text)
returns jsonb language plpgsql volatile security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  ts timestamptz := clock_timestamp();
  r public.runs;
  q public.run_questions;
  a public.snippet_answers;
  elapsed double precision;
  late boolean;
  pts integer := 0;
  nxt jsonb;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = 'PT401';
  end if;

  select * into r from public.runs where id = p_run and user_id = uid for update;
  if not found then
    raise exception 'run_not_found' using errcode = 'PT404';
  end if;

  select * into q from public.run_questions where run_id = p_run and n = p_n for update;
  if not found then
    raise exception 'question_not_found' using errcode = 'PT404';
  end if;

  select * into a from public.snippet_answers where snippet_id = q.snippet_id;

  if q.answered_at is null then
    if r.status <> 'active' then
      raise exception 'run_not_active' using errcode = 'PT409';
    end if;
    if p_choice is not null and not (p_choice = any (q.options)) then
      raise exception 'invalid_choice' using errcode = 'PT400';
    end if;

    -- 300 ms grace covers the network round trip
    elapsed := greatest(0, extract(epoch from (ts - q.issued_at)) * 1000 - 300);
    late := p_choice is null or elapsed > q.limit_ms;

    if not late and p_choice = a.answer then
      pts := private.points(q.limit_ms - elapsed, q.limit_ms, r.streak);
      r.score := r.score + pts;
      r.streak := r.streak + 1;
      r.best_streak := greatest(r.best_streak, r.streak);
      r.correct := r.correct + 1;
    else
      r.streak := 0;
      r.lives := r.lives - 1;
    end if;
    r.answered := r.answered + 1;

    update public.run_questions
    set choice = p_choice, timed_out = late, answered_at = ts, gained = pts
    where run_id = p_run and n = p_n;

    update public.runs
    set score = r.score, streak = r.streak, best_streak = r.best_streak, lives = r.lives,
        answered = r.answered, correct = r.correct, updated_at = now()
    where id = p_run;

    if r.lives = 0 then
      perform private.finish_run(p_run);
    else
      nxt := private.issue_question(p_run);
    end if;

    q.choice := p_choice;
    q.timed_out := late;
    q.gained := pts;
  elsif r.status = 'active' then
    select jsonb_build_object('n', x.n, 'snippet_id', x.snippet_id,
                              'options', to_jsonb(x.options), 'limit_ms', x.limit_ms)
    into nxt
    from public.run_questions x
    where x.run_id = p_run and x.answered_at is null;
  end if;

  select * into r from public.runs where id = p_run;

  return jsonb_build_object(
    'result', jsonb_build_object(
      'correct', coalesce(q.choice = a.answer and not q.timed_out, false),
      'timed_out', q.timed_out,
      'answer', a.answer,
      'title', a.title,
      'why', a.why,
      'gained', q.gained,
      'score', r.score,
      'streak', r.streak,
      'lives', r.lives
    ),
    'next', nxt,
    'final', case when r.status = 'finished' then private.final_json(r) end
  );
end
$$;

create function public.end_run(p_run uuid)
returns jsonb language plpgsql volatile security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  r public.runs;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = 'PT401';
  end if;

  perform 1 from public.runs where id = p_run and user_id = uid for update;
  if not found then
    raise exception 'run_not_found' using errcode = 'PT404';
  end if;

  perform private.finish_run(p_run);
  select * into r from public.runs where id = p_run;
  return jsonb_build_object('final', private.final_json(r));
end
$$;

-- ─── access ─────────────────────────────────────────────────────────────────

revoke all on all functions in schema private from public, anon, authenticated;

revoke execute on function
  public.start_run(text), public.submit_answer(uuid, integer, text), public.end_run(uuid)
from public, anon;

grant execute on function
  public.start_run(text), public.submit_answer(uuid, integer, text), public.end_run(uuid)
to authenticated;
