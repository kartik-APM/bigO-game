import { describe, expect, test, vi } from 'vitest';
import { MISSING_SNIPPET, initialRankedState, rankedReducer, rankedView, type RankedState } from '../src/game/ranked-state';
import type { AnswerResponse, RankedQuestion, StartedRun } from '../src/lib/ranked';

vi.mock('../src/lib/supabase', () => ({ supabase: null }));
const { friendlyError } = await import('../src/lib/ranked');

const q = (n: number, snippet_id = 'gauss'): RankedQuestion => ({
  n,
  snippet_id,
  options: ['O(1)', 'O(log n)', 'O(√n)', 'O(n)'],
  limit_ms: 15000 - 500 * (n - 1),
});
const started: StartedRun = { run_id: 'run-1', score: 0, streak: 0, lives: 3, question: q(1) };
const reply = (over: Partial<AnswerResponse['result']>, next: RankedQuestion | null, final: AnswerResponse['final'] = null): AnswerResponse => ({
  result: { correct: true, timed_out: false, answer: 'O(1)', title: 'sum 1..n by formula', why: 'closed form', gained: 200, score: 200, streak: 1, lives: 3, ...over },
  next,
  final,
});
const play = (...events: Parameters<typeof rankedReducer>[1][]) =>
  events.reduce<RankedState>(rankedReducer, initialRankedState());

describe('rankedReducer', () => {
  test('a started run shows question 1', () => {
    const s = play({ type: 'request' }, { type: 'started', lang: 'java', run: started, now: 50 });
    expect(s).toMatchObject({ phase: 'question', lang: 'java', runId: 'run-1', startedAt: 50, busy: false, lives: 3 });
    expect(rankedView(s)).toMatchObject({ number: 1, limitMs: 15000, options: q(1).options, error: null });
    expect(rankedView(s).snippet?.id).toBe('gauss');
  });

  test('a submitted answer is busy until the server replies', () => {
    const s = play({ type: 'started', lang: 'cpp', run: started, now: 0 }, { type: 'request', choice: 'O(1)' });
    expect(s).toMatchObject({ busy: true, choice: 'O(1)', phase: 'question' });
  });

  test('the reply reveals the server’s verdict and queues the next question', () => {
    const s = play(
      { type: 'started', lang: 'cpp', run: started, now: 0 },
      { type: 'request', choice: 'O(1)' },
      { type: 'answered', response: reply({}, q(2, 'halvings')) },
    );
    expect(s).toMatchObject({ phase: 'reveal', busy: false, score: 200, streak: 1, answered: 1, correct: 1, bestStreak: 1 });
    expect(rankedView(s)).toMatchObject({ correctAnswer: 'O(1)', gained: 200, title: 'sum 1..n by formula', timedOut: false });

    const after = rankedReducer(s, { type: 'advance', now: 900 });
    expect(after).toMatchObject({ phase: 'question', startedAt: 900, choice: null, result: null });
    expect(rankedView(after)).toMatchObject({ number: 2, limitMs: 14500 });
  });

  test('a duplicate reply after the reveal is ignored', () => {
    const r = reply({}, q(2));
    const s = play({ type: 'started', lang: 'cpp', run: started, now: 0 }, { type: 'answered', response: r });
    expect(rankedReducer(s, { type: 'answered', response: r })).toBe(s);
  });

  test('the last life ends the run with the server’s final numbers', () => {
    const s = play(
      { type: 'started', lang: 'cpp', run: started, now: 0 },
      { type: 'answered', response: reply({ correct: false, gained: 0, score: 0, streak: 0, lives: 0 }, null, { score: 0, correct: 0, answered: 1, best_streak: 0 }) },
      { type: 'advance', now: 1 },
    );
    expect(s).toMatchObject({ phase: 'over', lives: 0, final: { answered: 1 } });
  });

  test('a failure clears busy and keeps the question open for a retry', () => {
    const s = play(
      { type: 'started', lang: 'cpp', run: started, now: 0 },
      { type: 'request', choice: 'O(n)' },
      { type: 'failed', message: 'Could not reach the server.' },
    );
    expect(s).toMatchObject({ phase: 'question', busy: false, error: 'Could not reach the server.', choice: 'O(n)' });
    expect(rankedReducer(s, { type: 'request', choice: 'O(n)' })).toMatchObject({ busy: true, error: null });
  });

  test('ending a run early shows the final score', () => {
    const s = play(
      { type: 'started', lang: 'cpp', run: started, now: 0 },
      { type: 'ended', final: { score: 450, correct: 2, answered: 3, best_streak: 2 } },
    );
    expect(s).toMatchObject({ phase: 'over', score: 450, correct: 2, answered: 3, bestStreak: 2 });
  });

  test('reset keeps the language', () => {
    const s = play({ type: 'started', lang: 'python', run: started, now: 0 }, { type: 'reset' });
    expect(s).toEqual(initialRankedState('python'));
  });

  test('a snippet the app does not have becomes an error instead of a blank screen', () => {
    const s = play({ type: 'started', lang: 'cpp', run: { ...started, question: q(1, 'not-in-this-build') }, now: 0 });
    expect(rankedView(s)).toMatchObject({ snippet: null, error: MISSING_SNIPPET });
  });
});

describe('friendlyError', () => {
  test.each([
    ['rate_limited', /30 ranked runs/],
    ['not_authenticated', /Sign in again/],
    ['run_not_active', /already ended/],
    ['TypeError: Failed to fetch', /Could not reach the server/],
    ['something odd', /Something went wrong: something odd/],
  ])('%s', (message, expected) => {
    expect(friendlyError(message)).toMatch(expected);
  });
});
