// Ranked runs: the SQL game functions from migration 2, exercised the way the
// app will call them, plus exact scoring parity with src/game/engine.ts.

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { COMPLEXITIES } from '../src/data/complexities';
import { multiplier, points, timeLimit } from '../src/game/engine';
import { createSupabaseDb, type TestDb } from './support/supabase-db';

const A = '00000000-0000-0000-0000-0000000000a1';
const B = '00000000-0000-0000-0000-0000000000b2';
const C = '00000000-0000-0000-0000-0000000000c3';
const ORDER: string[] = COMPLEXITIES.map((c) => c.id);

interface Question { n: number; snippet_id: string; options: string[]; limit_ms: number }
interface Result {
  correct: boolean; timed_out: boolean; answer: string; title: string; why: string;
  gained: number; score: number; streak: number; lives: number;
}
interface Final { score: number; correct: number; answered: number; best_streak: number }
interface Started { run_id: string; score: number; streak: number; lives: number; question: Question }
interface Answered { result: Result; next: Question | null; final: Final | null }

let t: TestDb;

async function rpc<T>(sub: string, call: string, params: unknown[] = []): Promise<T> {
  await t.asUser(sub);
  try {
    return (await t.db.query<{ r: T }>(`select public.${call} as r`, params)).rows[0].r;
  } finally {
    await t.asAdmin();
  }
}
const start = (sub: string, lang = 'cpp') => rpc<Started>(sub, 'start_run($1)', [lang]);
const submit = (sub: string, run: string, n: number, choice: string | null) =>
  rpc<Answered>(sub, 'submit_answer($1, $2, $3)', [run, n, choice]);
const end = (sub: string, run: string) => rpc<{ final: Final }>(sub, 'end_run($1)', [run]);

async function answerOf(snippet: string): Promise<string> {
  await t.asAdmin();
  return (await t.db.query<{ answer: string }>(
    'select answer from public.snippet_answers where snippet_id = $1', [snippet],
  )).rows[0].answer;
}
async function wrongChoice(q: Question) {
  const right = await answerOf(q.snippet_id);
  return q.options.find((o) => o !== right)!;
}
/** Pretends the question was issued `ms` ago (negative = in the future, i.e. answered instantly). */
async function issuedAgo(run: string, n: number, ms: number) {
  await t.asAdmin();
  await t.db.query(
    `update public.run_questions set issued_at = clock_timestamp() - make_interval(secs => $3::float8 / 1000)
     where run_id = $1 and n = $2`,
    [run, n, ms],
  );
}
async function runRow(run: string) {
  await t.asAdmin();
  return (await t.db.query<{ status: string; flagged: boolean; deck: string[]; score: number }>(
    'select status, flagged, deck, score from public.runs where id = $1', [run],
  )).rows[0];
}
/** Answers the current question correctly, as if instantly. */
async function answerRight(sub: string, run: string, q: Question) {
  await issuedAgo(run, q.n, -60_000);
  return submit(sub, run, q.n, await answerOf(q.snippet_id));
}

beforeAll(async () => {
  t = await createSupabaseDb();
  await t.db.exec(`
    insert into auth.users values
      ('${A}', '{"full_name":"Ada"}'), ('${B}', '{"full_name":"Bo"}'), ('${C}', '{"full_name":"Cy"}');
  `);
}, 30_000);

afterAll(() => t?.db.close());

describe('scoring parity with engine.ts', () => {
  test('time_limit and multiplier match for 0..300', async () => {
    const xs = Array.from({ length: 301 }, (_, i) => i);
    const { rows } = await t.db.query<{ l: number; m: number }>(
      'select private.time_limit(x) l, private.multiplier(x) m from unnest($1::int[]) with ordinality u(x, i) order by i',
      [xs],
    );
    expect(rows.map((r) => r.l)).toEqual(xs.map(timeLimit));
    expect(rows.map((r) => r.m)).toEqual(xs.map(multiplier));
  });

  test('points match exactly across limits, streaks and remaining times', async () => {
    const cases: [number, number, number][] = [];
    for (let limit = 7000; limit <= 15000; limit += 500) {
      for (const streak of [0, 1, 3, 4, 7, 8, 11, 12, 15, 16, 40]) {
        const fixed = [0, 1, 0.5, 299.7, limit / 3, limit / 2, limit - 1, limit, -25];
        const random = Array.from({ length: 25 }, () => Math.random() * limit);
        for (const remaining of [...fixed, ...random]) cases.push([remaining, limit, streak]);
      }
    }
    const { rows } = await t.db.query<{ p: number }>(
      `select private.points(r, l, s) p
       from unnest($1::float8[], $2::int[], $3::int[]) with ordinality u(r, l, s, i) order by i`,
      [cases.map((c) => c[0]), cases.map((c) => c[1]), cases.map((c) => c[2])],
    );
    expect(rows.map((r) => r.p)).toEqual(cases.map(([r, l, s]) => points(r, l, s)));
  });

  test.each(ORDER)('options for %s: answer plus nearby distractors, cheapest first', async (id) => {
    const at = ORDER.indexOf(id);
    const distances = ORDER.filter((x) => x !== id).map((x) => Math.abs(ORDER.indexOf(x) - at)).sort((a, b) => a - b);
    const maxDistance = distances[4];
    const { rows } = await t.db.query<{ o: string[] }>(
      'select private.pick_options($1) o from generate_series(1, 200)', [id],
    );
    for (const { o } of rows) {
      expect(o).toHaveLength(4);
      expect(new Set(o).size).toBe(4);
      expect(o).toContain(id);
      expect([...o].sort((x, y) => ORDER.indexOf(x) - ORDER.indexOf(y))).toEqual(o);
      for (const x of o) expect(Math.abs(ORDER.indexOf(x) - at)).toBeLessThanOrEqual(maxDistance);
    }
  });
});

describe('access', () => {
  test('signed-out visitors cannot call the game functions', async () => {
    await t.asAnon();
    await expect(t.db.query(`select public.start_run('cpp')`)).rejects.toThrow(/permission denied/);
    await t.asAdmin();
  });

  test('players cannot call private helpers', async () => {
    await t.asUser(A);
    await expect(t.db.query('select private.points(1, 1, 1)')).rejects.toThrow(/permission denied/);
    await t.asAdmin();
  });

  test('a session without a user id is rejected', async () => {
    await t.db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '', false);`);
    await expect(t.db.query(`select public.start_run('cpp')`)).rejects.toThrow(/not_authenticated/);
    await t.asAdmin();
  });

  test('unknown languages are rejected', async () => {
    await expect(start(A, 'rust')).rejects.toThrow(/invalid_language/);
  });
});

describe('a ranked run', () => {
  let run: string;
  let q: Question;
  let halfGain = 0;

  test('starts with a full deck and a first question', async () => {
    const s = await start(A);
    run = s.run_id;
    q = s.question;
    expect(s).toMatchObject({ score: 0, streak: 0, lives: 3 });
    expect(q).toMatchObject({ n: 1, limit_ms: 15000 });
    expect(q.options).toContain(await answerOf(q.snippet_id));
    const row = await runRow(run);
    expect(new Set(row.deck).size).toBe(100);
    expect(row.status).toBe('active');
  });

  test('an instant correct answer earns full points and issues question 2', async () => {
    const r = await answerRight(A, run, q);
    expect(r.result).toMatchObject({ correct: true, timed_out: false, gained: 200, score: 200, streak: 1, lives: 3 });
    expect(r.next).toMatchObject({ n: 2, limit_ms: 14500 });
    expect(r.final).toBeNull();
    q = r.next!;
  });

  test('a half-time answer earns half the speed bonus', async () => {
    await issuedAgo(run, q.n, 300 + q.limit_ms / 2);
    const r = await submit(A, run, q.n, await answerOf(q.snippet_id));
    halfGain = points(q.limit_ms / 2, q.limit_ms, 1);
    expect(r.result.gained).toBe(halfGain);
    q = r.next!;
  });

  test('replaying an answered question returns the same result without scoring twice', async () => {
    const before = await runRow(run);
    const r = await submit(A, run, 1, 'O(n!)');
    expect(r.result).toMatchObject({ correct: true, gained: 200, score: before.score });
    expect(r.next).toMatchObject({ n: q.n });
    expect((await runRow(run)).score).toBe(before.score);
  });

  test('choices outside the four options are rejected', async () => {
    const outside = ORDER.find((x) => !q.options.includes(x))!;
    await expect(submit(A, run, q.n, outside)).rejects.toThrow(/invalid_choice/);
  });

  test('questions that have not been issued are rejected', async () => {
    await expect(submit(A, run, q.n + 5, q.options[0])).rejects.toThrow(/question_not_found/);
  });

  test('another player cannot answer or end this run', async () => {
    await expect(submit(B, run, q.n, q.options[0])).rejects.toThrow(/run_not_found/);
    await expect(end(B, run)).rejects.toThrow(/run_not_found/);
  });

  test('a late correct answer counts as a timeout', async () => {
    await issuedAgo(run, q.n, q.limit_ms + 300 + 1000);
    const r = await submit(A, run, q.n, await answerOf(q.snippet_id));
    expect(r.result).toMatchObject({ correct: false, timed_out: true, gained: 0, streak: 0, lives: 2 });
    q = r.next!;
  });

  test('a null choice is a timeout', async () => {
    const r = await submit(A, run, q.n, null);
    expect(r.result).toMatchObject({ timed_out: true, lives: 1 });
    q = r.next!;
  });

  test('losing the last life finishes the run', async () => {
    const r = await submit(A, run, q.n, await wrongChoice(q));
    expect(r.result).toMatchObject({ correct: false, lives: 0 });
    expect(r.next).toBeNull();
    expect(r.final).toEqual({ score: 200 + halfGain, answered: 5, correct: 2, best_streak: 2 });
    expect((await runRow(run)).status).toBe('finished');
  });

  test('a finished run accepts no new answers', async () => {
    await expect(submit(A, run, q.n + 1, q.options[0])).rejects.toThrow(/question_not_found/);
  });
});

describe('run lifecycle', () => {
  test('end_run finishes a run and blocks the pending question', async () => {
    const s = await start(B);
    const e = await end(B, s.run_id);
    expect(e.final).toMatchObject({ score: 0, answered: 0 });
    await expect(submit(B, s.run_id, 1, s.question.options[0])).rejects.toThrow(/run_not_active/);
    expect((await end(B, s.run_id)).final).toEqual(e.final);
  });

  test('starting a new run finishes the previous one', async () => {
    const first = await start(B);
    const second = await start(B);
    expect((await runRow(first.run_id)).status).toBe('finished');
    expect((await runRow(second.run_id)).status).toBe('active');
  });

  test('the multiplier steps up after four in a row', async () => {
    let { run_id: run, question: q } = await start(B);
    const gains: number[] = [];
    for (let i = 0; i < 9; i++) {
      const r = await answerRight(B, run, q);
      gains.push(r.result.gained);
      q = r.next!;
    }
    expect(gains).toEqual([200, 200, 200, 200, 400, 400, 400, 400, 600]);
    await end(B, run);
  });

  test('the deck reshuffles once it is used up', async () => {
    let { run_id: run, question: q } = await start(C);
    await t.db.query('update public.runs set deck = deck[1:3] where id = $1', [run]);
    const seen: string[] = [];
    for (let i = 0; i < 4; i++) {
      seen.push(q.snippet_id);
      q = (await answerRight(C, run, q)).next!;
    }
    expect(q.n).toBe(5);
    const deck = (await runRow(run)).deck;
    expect(deck).toHaveLength(100);
    expect(seen[3]).not.toBe(seen[2]);
    await end(C, run);
  });

  test('instant answers get the run flagged; human-speed answers do not', async () => {
    let { run_id: fast, question: q } = await start(C);
    for (let i = 0; i < 5; i++) q = (await answerRight(C, fast, q)).next!;
    await end(C, fast);
    expect((await runRow(fast)).flagged).toBe(true);

    let { run_id: human, question: h } = await start(C);
    for (let i = 0; i < 5; i++) {
      await issuedAgo(human, h.n, 2500);
      h = (await submit(C, human, h.n, await answerOf(h.snippet_id))).next!;
    }
    await end(C, human);
    expect((await runRow(human)).flagged).toBe(false);
  });

  test('runs idle for more than 10 minutes are finished by the next start', async () => {
    const idle = await start(A);
    await t.db.query(`update public.runs set updated_at = now() - interval '11 minutes' where id = $1`, [idle.run_id]);
    await end(B, (await start(B)).run_id);
    expect((await runRow(idle.run_id)).status).toBe('finished');
  });

  test('more than 30 starts an hour are refused', async () => {
    await t.db.exec(`
      insert into public.runs (user_id, lang, deck, status, finished_at)
      select '${C}', 'cpp', array['gauss'], 'finished', now() from generate_series(1, 30);
    `);
    await expect(start(C)).rejects.toThrow(/rate_limited/);
  });

  test('players can read their own run history but never the answer key', async () => {
    await t.asUser(A);
    expect(await t.count('public.runs')).toBeGreaterThan(0);
    expect(await t.count(`public.runs where user_id <> '${A}'`)).toBe(0);
    await expect(t.db.query('select * from public.snippet_answers')).rejects.toThrow(/permission denied/);
    await t.asAdmin();
  });
});

