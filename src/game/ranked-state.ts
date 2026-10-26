import { SNIPPETS } from '../data/snippets';
import type { ComplexityId, Lang, Snippet } from '../data/types';
import type { AnswerResponse, RankedFinal, RankedQuestion, RankedResult, StartedRun } from '../lib/ranked';
import { START_LIVES, START_TIME_MS, type Phase } from './engine';
import type { RunView } from './run';

// Pure state for a ranked run. The server decides every outcome; this only
// records what it said, so it can be tested by feeding it real server responses.

export interface RankedState {
  phase: Phase;
  lang: Lang;
  runId: string | null;
  question: RankedQuestion | null;
  startedAt: number;
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  answered: number;
  correct: number;
  choice: ComplexityId | null;
  result: RankedResult | null;
  next: RankedQuestion | null;
  final: RankedFinal | null;
  busy: boolean;
  error: string | null;
}

export type RankedEvent =
  | { type: 'request'; choice?: ComplexityId | null }
  | { type: 'failed'; message: string }
  | { type: 'started'; lang: Lang; run: StartedRun; now: number }
  | { type: 'answered'; response: AnswerResponse }
  | { type: 'advance'; now: number }
  | { type: 'ended'; final: RankedFinal }
  | { type: 'reset' };

export const initialRankedState = (lang: Lang = 'cpp'): RankedState => ({
  phase: 'idle',
  lang,
  runId: null,
  question: null,
  startedAt: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lives: START_LIVES,
  answered: 0,
  correct: 0,
  choice: null,
  result: null,
  next: null,
  final: null,
  busy: false,
  error: null,
});

const applyFinal = (s: RankedState, f: RankedFinal): RankedState => ({
  ...s,
  final: f,
  score: f.score,
  correct: f.correct,
  answered: f.answered,
  bestStreak: f.best_streak,
});

export function rankedReducer(s: RankedState, e: RankedEvent): RankedState {
  switch (e.type) {
    case 'request':
      return { ...s, busy: true, error: null, ...('choice' in e ? { choice: e.choice ?? null } : {}) };

    case 'failed':
      return { ...s, busy: false, error: e.message };

    case 'started':
      return {
        ...initialRankedState(e.lang),
        phase: 'question',
        runId: e.run.run_id,
        question: e.run.question,
        startedAt: e.now,
        score: e.run.score,
        streak: e.run.streak,
        lives: e.run.lives,
      };

    case 'answered': {
      if (s.phase !== 'question') return s;
      const { result, next, final } = e.response;
      const answered: RankedState = {
        ...s,
        phase: 'reveal',
        busy: false,
        error: null,
        result,
        next,
        score: result.score,
        streak: result.streak,
        lives: result.lives,
        bestStreak: Math.max(s.bestStreak, result.streak),
        answered: s.answered + 1,
        correct: s.correct + (result.correct ? 1 : 0),
      };
      return final ? applyFinal(answered, final) : answered;
    }

    case 'advance':
      if (s.phase !== 'reveal') return s;
      if (s.final || !s.next) return { ...s, phase: 'over' };
      return {
        ...s,
        phase: 'question',
        question: s.next,
        next: null,
        startedAt: e.now,
        choice: null,
        result: null,
      };

    case 'ended':
      return { ...applyFinal(s, e.final), phase: 'over', busy: false, error: null };

    case 'reset':
      return initialRankedState(s.lang);
  }
}

const SNIPPET_BY_ID = new Map(SNIPPETS.map((s) => [s.id, s]));

export const MISSING_SNIPPET =
  'This question is missing from your copy of the app. Reload the page to update it.';

/** Everything the screens need, apart from the actions. */
export function rankedView(
  s: RankedState,
  lookup: (id: string) => Snippet | undefined = (id) => SNIPPET_BY_ID.get(id),
): Omit<RunView, 'retry'> {
  const snippet = s.question ? (lookup(s.question.snippet_id) ?? null) : null;
  const missing = s.question !== null && snippet === null && s.phase !== 'idle' && s.phase !== 'over';
  return {
    mode: 'ranked',
    phase: s.phase,
    lang: s.lang,
    snippet,
    number: s.question?.n ?? 0,
    options: s.question?.options ?? [],
    limitMs: s.question?.limit_ms ?? START_TIME_MS,
    startedAt: s.startedAt,
    score: s.score,
    streak: s.streak,
    bestStreak: s.bestStreak,
    lives: s.lives,
    answered: s.answered,
    correct: s.correct,
    choice: s.choice,
    timedOut: s.result?.timed_out ?? false,
    gained: s.result?.gained ?? 0,
    correctAnswer: s.result?.answer ?? null,
    title: s.result?.title ?? '',
    why: s.result?.why ?? '',
    busy: s.busy,
    error: s.error ?? (missing ? MISSING_SNIPPET : null),
  };
}
