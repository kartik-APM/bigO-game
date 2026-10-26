// The app's ranked-run reducer driven by real responses from the SQL functions
// (via PGlite), so a change on either side that breaks the contract fails here.

import { afterAll, beforeAll, expect, test } from 'vitest';
import { initialRankedState, rankedReducer, rankedView, type RankedState } from '../src/game/ranked-state';
import type { AnswerResponse, RankedFinal, StartedRun } from '../src/lib/ranked';
import { createSupabaseDb, type TestDb } from './support/supabase-db';

const P = '00000000-0000-0000-0000-0000000000f1';
let t: TestDb;

async function rpc<T>(call: string, params: unknown[]): Promise<T> {
  await t.asUser(P);
  try {
    return (await t.db.query<{ r: T }>(`select public.${call} as r`, params)).rows[0].r;
  } finally {
    await t.asAdmin();
  }
}
async function answerOf(snippet: string) {
  return (await t.db.query<{ a: string }>('select answer a from public.snippet_answers where snippet_id = $1', [snippet])).rows[0].a;
}
async function instant(run: string, n: number) {
  await t.db.query(`update public.run_questions set issued_at = clock_timestamp() + interval '1 minute' where run_id = $1 and n = $2`, [run, n]);
}

beforeAll(async () => {
  t = await createSupabaseDb();
  await t.db.exec(`insert into auth.users values ('${P}', '{"full_name":"Flow Tester"}');`);
}, 30_000);

afterAll(() => t?.db.close());

test('a full ranked run through the SQL functions and the app reducer', async () => {
  let s: RankedState = initialRankedState();
  const step = (e: Parameters<typeof rankedReducer>[1]) => (s = rankedReducer(s, e));

  const run = await rpc<StartedRun>('start_run($1)', ['python']);
  step({ type: 'started', lang: 'python', run, now: 0 });
  expect(rankedView(s).snippet?.id).toBe(run.question.snippet_id);

  // one right answer
  let q = s.question!;
  await instant(run.run_id, q.n);
  const right = await answerOf(q.snippet_id);
  step({ type: 'request', choice: right as never });
  step({ type: 'answered', response: await rpc<AnswerResponse>('submit_answer($1, $2, $3)', [run.run_id, q.n, right]) });
  expect(rankedView(s)).toMatchObject({ phase: 'reveal', score: 200, streak: 1, correctAnswer: right, gained: 200 });
  expect(rankedView(s).why.length).toBeGreaterThan(0);

  // three timeouts end it
  for (let i = 0; i < 3; i++) {
    step({ type: 'advance', now: i });
    q = s.question!;
    step({ type: 'request', choice: null });
    step({ type: 'answered', response: await rpc<AnswerResponse>('submit_answer($1, $2, $3)', [run.run_id, q.n, null]) });
    expect(rankedView(s).timedOut).toBe(true);
  }
  expect(s.final).toEqual({ score: 200, correct: 1, answered: 4, best_streak: 1 });
  step({ type: 'advance', now: 9 });
  expect(s).toMatchObject({ phase: 'over', score: 200, answered: 4, correct: 1, bestStreak: 1 });
});

test('ending a run early through end_run', async () => {
  let s: RankedState = initialRankedState();
  const run = await rpc<StartedRun>('start_run($1)', ['java']);
  s = rankedReducer(s, { type: 'started', lang: 'java', run, now: 0 });
  const { final } = await rpc<{ final: RankedFinal }>('end_run($1)', [run.run_id]);
  s = rankedReducer(s, { type: 'ended', final });
  expect(s).toMatchObject({ phase: 'over', score: 0, answered: 0 });
});
