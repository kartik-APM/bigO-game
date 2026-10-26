/// <reference types="node" />
// Applies the Supabase migration and answer key to an in-process Postgres
// (PGlite) with small stand-ins for Supabase's auth schema and client roles,
// then checks triggers, row-level security, grants and constraints.

import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { buildAnswersSql } from '../scripts/gen-answers-sql.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');

const A = '00000000-0000-0000-0000-00000000000a';
const B = '00000000-0000-0000-0000-00000000000b';
const C = '00000000-0000-0000-0000-00000000000c';
const RUN_A = '10000000-0000-0000-0000-000000000001';
const RUN_B = '20000000-0000-0000-0000-000000000002';

let db: PGlite;
let answers: string;

const count = async (sql: string) => (await db.query<{ c: number }>(`select count(*)::int c from ${sql}`)).rows[0].c;
const asUser = (sub: string) =>
  db.exec(`reset role; set role authenticated; select set_config('request.jwt.claim.sub', '${sub}', false);`);
const asAnon = () => db.exec(`reset role; set role anon; select set_config('request.jwt.claim.sub', '', false);`);
const asAdmin = () => db.exec('reset role;');

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    grant usage on schema public to anon, authenticated;
    -- Supabase grants clients everything by default and relies on RLS; mirror that
    alter default privileges in schema public grant all on tables to anon, authenticated;
    alter default privileges in schema public grant all on functions to anon, authenticated;
    create schema auth;
    grant usage on schema auth to anon, authenticated;
    create table auth.users (id uuid primary key, raw_user_meta_data jsonb not null default '{}');
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant execute on function auth.uid() to anon, authenticated;
    insert into auth.users values ('${A}', '{"full_name":"Ada","avatar_url":"https://x/a.png"}');
  `);
  for (const file of readdirSync(MIGRATIONS).sort()) {
    await db.exec(readFileSync(join(MIGRATIONS, file), 'utf8'));
  }
  answers = buildAnswersSql();
  await db.exec(answers);
}, 30_000);

afterAll(() => db?.close());

describe('answer key', () => {
  test('loads every snippet and can be re-run', async () => {
    const snippets = readdirSync(join(ROOT, 'snippets')).length;
    await db.exec(answers);
    expect(await count('public.snippet_answers')).toBe(snippets);
  });

  test('supabase/answers.sql matches snippets/*/meta.json', () => {
    expect(readFileSync(join(ROOT, 'supabase', 'answers.sql'), 'utf8')).toBe(answers);
  });
});

describe('profiles', () => {
  test('users who signed in before the migration are backfilled', async () => {
    const { rows } = await db.query(`select display_name, avatar_url from public.profiles where id = '${A}'`);
    expect(rows).toEqual([{ display_name: 'Ada', avatar_url: 'https://x/a.png' }]);
  });

  test('new users get a profile, with name fallbacks', async () => {
    await db.exec(`insert into auth.users values ('${B}', '{"name":"  Bea  "}'), ('${C}', '{}')`);
    const { rows } = await db.query(`select display_name from public.profiles where id in ('${B}','${C}') order by id`);
    expect(rows).toEqual([{ display_name: 'Bea' }, { display_name: 'player' }]);
  });
});

describe('row-level security and grants', () => {
  beforeAll(async () => {
    await asAdmin();
    await db.exec(`
      insert into public.runs (id, user_id, lang, deck) values
        ('${RUN_A}', '${A}', 'cpp', array['gauss']),
        ('${RUN_B}', '${B}', 'java', array['gauss']);
      insert into public.run_questions (run_id, n, snippet_id, options, limit_ms) values
        ('${RUN_A}', 1, 'gauss', array['O(1)','O(log n)','O(√n)','O(n)'], 15000),
        ('${RUN_B}', 1, 'gauss', array['O(1)','O(log n)','O(√n)','O(n)'], 15000);
    `);
  });
  afterAll(asAdmin);

  test('a signed-in player reads only their own rows', async () => {
    await asUser(A);
    expect(await count('public.runs')).toBe(1);
    expect(await count('public.run_questions')).toBe(1);
    expect(await count('public.profiles')).toBe(1);
    expect(await count('public.complexity_classes')).toBe(9);
  });

  test.each([
    ['read the answer key', 'select * from public.snippet_answers'],
    ['insert a run', `insert into public.runs (user_id, lang, deck) values ('${A}', 'cpp', array['gauss'])`],
    ['change a score', 'update public.runs set score = 999999'],
    ['edit a profile', `update public.profiles set display_name = 'x'`],
    ['delete run questions', 'delete from public.run_questions'],
    ['call the trigger function', 'select public.handle_new_user()'],
  ])('a signed-in player cannot %s', async (_, sql) => {
    await asUser(A);
    await expect(db.exec(sql)).rejects.toThrow(/permission denied/);
  });

  test('signed-out visitors see classes only', async () => {
    await asAnon();
    expect(await count('public.complexity_classes')).toBe(9);
    expect(await count('public.runs')).toBe(0);
    await expect(db.exec('select * from public.snippet_answers')).rejects.toThrow(/permission denied/);
  });
});

describe('constraints', () => {
  beforeAll(asAdmin);

  test.each([
    ['a second active run', `insert into public.runs (user_id, lang, deck) values ('${A}', 'cpp', array['gauss'])`, /runs_one_active_per_user/],
    ['finishing without finished_at', `update public.runs set status = 'finished' where id = '${RUN_A}'`, /check constraint/],
    ['more correct than answered', `update public.runs set correct = 5 where id = '${RUN_A}'`, /check constraint/],
    ['an unknown language', `insert into public.runs (user_id, lang, deck) values ('${C}', 'rust', array['gauss'])`, /check constraint/],
    ['a non-kebab-case snippet id', `insert into public.snippet_answers values ('Bad_Id', 'O(n)', 't', 'w')`, /check constraint/],
    ['an unknown answer class', `insert into public.snippet_answers values ('x', 'O(n^2)', 't', 'w')`, /foreign key/],
  ])('rejects %s', async (_, sql, error) => {
    await expect(db.exec(sql)).rejects.toThrow(error);
  });

  test('a new run is allowed once the previous one is finished', async () => {
    await db.exec(`update public.runs set status = 'finished', finished_at = now() where id = '${RUN_A}'`);
    await expect(
      db.exec(`insert into public.runs (user_id, lang, deck) values ('${A}', 'python', array['gauss'])`),
    ).resolves.toBeDefined();
  });

  test('removing a snippet that past runs used fails and changes nothing', async () => {
    const withoutGauss = answers.replace(/^ {2}'gauss',\n/m, '').replace(/^ {2}\('gauss'.*\n/m, '');
    await expect(db.exec(withoutGauss)).rejects.toThrow(/foreign key/);
    await db.exec('rollback');
    expect(await count(`public.snippet_answers where snippet_id = 'gauss'`)).toBe(1);
  });

  test('deleting a user removes their profile, runs and questions', async () => {
    await db.exec(`delete from auth.users where id = '${B}'`);
    expect(await count(`public.profiles where id = '${B}'`)).toBe(0);
    expect(await count(`public.runs where user_id = '${B}'`)).toBe(0);
    expect(await count(`public.run_questions where run_id = '${RUN_B}'`)).toBe(0);
  });
});
