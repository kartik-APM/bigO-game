/// <reference types="node" />
// An in-process Postgres (PGlite) with small stand-ins for what Supabase
// provides: the anon/authenticated roles, its default grants, auth.users and
// auth.uid(). Applies every migration in supabase/migrations plus the answer key.

import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAnswersSql } from '../../scripts/gen-answers-sql.mjs';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');

const SUPABASE_STANDINS = `
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
`;

export interface TestDb {
  db: PGlite;
  answers: string;
  asUser: (sub: string) => Promise<unknown>;
  asAnon: () => Promise<unknown>;
  asAdmin: () => Promise<unknown>;
  count: (fromWhere: string) => Promise<number>;
}

export async function createSupabaseDb(beforeMigrations = ''): Promise<TestDb> {
  const db = new PGlite();
  await db.exec(SUPABASE_STANDINS);
  if (beforeMigrations) await db.exec(beforeMigrations);
  for (const file of readdirSync(MIGRATIONS).sort()) {
    await db.exec(readFileSync(join(MIGRATIONS, file), 'utf8'));
  }
  const answers = buildAnswersSql();
  await db.exec(answers);

  return {
    db,
    answers,
    asUser: (sub) =>
      db.exec(`reset role; set role authenticated; select set_config('request.jwt.claim.sub', '${sub}', false);`),
    asAnon: () => db.exec(`reset role; set role anon; select set_config('request.jwt.claim.sub', '', false);`),
    asAdmin: () => db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`),
    count: async (fromWhere) =>
      (await db.query<{ c: number }>(`select count(*)::int c from ${fromWhere}`)).rows[0].c,
  };
}
