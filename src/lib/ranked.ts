import type { ComplexityId, Lang } from '../data/types';
import { supabase } from './supabase';

// Shapes returned by the SQL functions in supabase/migrations/20261026000200_ranked_runs.sql

export interface RankedQuestion {
  n: number;
  snippet_id: string;
  options: ComplexityId[];
  limit_ms: number;
}

export interface RankedResult {
  correct: boolean;
  timed_out: boolean;
  answer: ComplexityId;
  title: string;
  why: string;
  gained: number;
  score: number;
  streak: number;
  lives: number;
}

export interface RankedFinal {
  score: number;
  correct: number;
  answered: number;
  best_streak: number;
}

export interface StartedRun {
  run_id: string;
  score: number;
  streak: number;
  lives: number;
  question: RankedQuestion;
}

export interface AnswerResponse {
  result: RankedResult;
  next: RankedQuestion | null;
  final: RankedFinal | null;
}

const MESSAGES: Record<string, string> = {
  not_authenticated: 'Your session has expired. Sign in again to keep playing ranked.',
  rate_limited: 'You have started 30 ranked runs in the last hour. Take a break, or play practice.',
  run_not_found: 'This run could not be found.',
  run_not_active: 'This run has already ended.',
  question_not_found: 'That question is no longer open.',
  invalid_choice: 'That answer is not one of the options.',
  invalid_language: 'That language is not available for ranked play.',
  profile_missing: 'Your profile is missing. Sign out and sign in again.',
  no_snippets_loaded: 'Ranked play is not set up on the server yet.',
};

/** Turns a Supabase/PostgREST error message into something a player can act on. */
export function friendlyError(message: string): string {
  const known = MESSAGES[message.trim()];
  if (known) return known;
  if (/fetch|network|load failed/i.test(message)) return 'Could not reach the server. Check your connection.';
  return `Something went wrong: ${message}`;
}

async function call<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error(friendlyError('not_authenticated'));
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(friendlyError(error.message));
  return data as T;
}

export const startRun = (lang: Lang) => call<StartedRun>('start_run', { p_lang: lang });

export const submitAnswer = (runId: string, n: number, choice: ComplexityId | null) =>
  call<AnswerResponse>('submit_answer', { p_run: runId, p_n: n, p_choice: choice });

export const endRun = (runId: string) => call<{ final: RankedFinal }>('end_run', { p_run: runId });
