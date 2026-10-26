// Leaderboard: migration 3's leaderboard() and my_best(), checked against
// hand-built run histories.

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createSupabaseDb, type TestDb } from './support/supabase-db';

let t: TestDb;

// 12 players: p01 .. p12
const player = (i: number) => `00000000-0000-0000-0000-0000000001${String(i).padStart(2, '0')}`;
const name = (i: number) => `Player ${String(i).padStart(2, '0')} Fullname`;

async function finishedRun(i: number, score: number, opts: { flagged?: boolean; minutesAgo?: number; lang?: string } = {}) {
  await t.asAdmin();
  await t.db.query(
    `insert into public.runs (user_id, lang, deck, status, score, correct, answered, flagged, started_at, finished_at)
     values ($1, $2, array['gauss'], 'finished', $3, 3, 5, $4,
             now() - make_interval(mins => $5 + 1), now() - make_interval(mins => $5))`,
    [player(i), opts.lang ?? 'cpp', score, opts.flagged ?? false, opts.minutesAgo ?? 0],
  );
}

async function board(as?: string) {
  if (as) await t.asUser(as);
  else await t.asAnon();
  try {
    return (await t.db.query<Record<string, unknown>>('select * from public.leaderboard()')).rows;
  } finally {
    await t.asAdmin();
  }
}

async function myBest(as: string) {
  await t.asUser(as);
  try {
    return (await t.db.query<{ r: Record<string, unknown> | null }>('select public.my_best() r')).rows[0].r;
  } finally {
    await t.asAdmin();
  }
}

beforeAll(async () => {
  t = await createSupabaseDb();
  const users = Array.from({ length: 13 }, (_, k) => k + 1)
    .map((i) => `('${player(i)}', '{"full_name":"${name(i)}"}')`)
    .join(', ');
  await t.db.exec(`insert into auth.users values ${users};`);

  // p01..p10: one run each, scores 1000, 900, ..., 100
  for (let i = 1; i <= 10; i++) await finishedRun(i, 1100 - i * 100, { minutesAgo: 30 });
  // p03 has more runs; only the best counts, and a flagged higher one is ignored
  await finishedRun(3, 450, { minutesAgo: 20 });
  await finishedRun(3, 5000, { flagged: true, minutesAgo: 10 });
  // p05 ties p04 (700) with a later finish
  await finishedRun(5, 700, { minutesAgo: 5, lang: 'java' });
  // p11 and p12 fall outside the top 10
  await finishedRun(11, 90);
  await finishedRun(12, 50);
  // p13: only a flagged run, a zero-score run and an active run, so not on the board
  await finishedRun(13, 9999, { flagged: true });
  await finishedRun(13, 0);
  await t.db.query(
    `insert into public.runs (user_id, lang, deck, score, correct, answered) values ($1, 'cpp', array['gauss'], 8000, 5, 5)`,
    [player(13)],
  );
}, 30_000);

afterAll(() => t?.db.close());

describe('leaderboard()', () => {
  test('is public and returns the top 10 by best score, one row per player', async () => {
    const rows = await board();
    expect(rows).toHaveLength(10);
    expect(rows.map((r) => r.display_name)).toEqual([
      name(1), name(2), name(3), name(4), name(5), name(6), name(7), name(8), name(9), name(10),
    ]);
    expect(rows.map((r) => r.score)).toEqual([1000, 900, 800, 700, 700, 500, 400, 300, 200, 100]);
  });

  test('ties share a rank and the earlier finish is listed first', async () => {
    const rows = await board();
    expect(rows.slice(3, 6).map((r) => [r.rank, r.display_name, r.lang])).toEqual([
      [4, name(4), 'cpp'],
      [4, name(5), 'java'],
      [6, name(6), 'cpp'],
    ]);
  });

  test('ignores flagged, zero-score and unfinished runs', async () => {
    const rows = await board();
    expect(rows.find((r) => r.display_name === name(3))?.score).toBe(800);
    expect(rows.some((r) => r.display_name === name(13))).toBe(false);
  });

  test('never exposes player ids', async () => {
    const [row] = await board();
    expect(Object.keys(row).sort()).toEqual(
      ['answered', 'correct', 'display_name', 'finished_at', 'is_me', 'lang', 'rank', 'score'].sort(),
    );
  });

  test('marks only the caller’s own row', async () => {
    expect((await board()).every((r) => r.is_me === false)).toBe(true);
    const rows = await board(player(2));
    expect(rows.filter((r) => r.is_me).map((r) => r.display_name)).toEqual([name(2)]);
  });
});

describe('my_best()', () => {
  test('returns the caller’s best run and overall rank', async () => {
    expect(await myBest(player(3))).toMatchObject({ rank: 3, score: 800, lang: 'cpp' });
    expect(await myBest(player(5))).toMatchObject({ rank: 4, score: 700, lang: 'java' });
  });

  test('ranks players outside the top 10', async () => {
    expect(await myBest(player(12))).toMatchObject({ rank: 12, score: 50 });
  });

  test('is null when the caller has no counted run', async () => {
    expect(await myBest(player(13))).toBeNull();
  });

  test('is not available to signed-out visitors', async () => {
    await t.asAnon();
    await expect(t.db.query('select public.my_best()')).rejects.toThrow(/permission denied/);
    await t.asAdmin();
  });
});
