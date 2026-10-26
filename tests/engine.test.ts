import { describe, expect, test } from 'vitest';
import { COMPLEXITIES } from '../src/data/complexities';
import { SNIPPETS } from '../src/data/snippets';
import {
  MIN_TIME_MS,
  OPTION_COUNT,
  START_LIVES,
  currentSnippet,
  initialState,
  multiplier,
  pickOptions,
  reducer,
  timeLimit,
  type GameState,
} from '../src/game/engine';

const ORDER = COMPLEXITIES.map((c) => c.id);
const start = () => reducer(initialState(), { type: 'start', now: 0 });
const answerRight = (s: GameState, now = 0) =>
  reducer(s, { type: 'answer', choice: currentSnippet(s).answer, now });
const answerWrong = (s: GameState) =>
  reducer(s, { type: 'answer', choice: s.options.find((o) => o !== currentSnippet(s).answer)!, now: 0 });
const next = (s: GameState) => reducer(s, { type: 'next', now: 0 });

describe('pickOptions', () => {
  test.each(ORDER)('%s: answer plus distinct distractors, cheapest first', (id) => {
    for (let i = 0; i < 200; i++) {
      const opts = pickOptions(id);
      expect(opts).toHaveLength(OPTION_COUNT);
      expect(new Set(opts).size).toBe(OPTION_COUNT);
      expect(opts).toContain(id);
      expect([...opts].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))).toEqual(opts);
    }
  });
});

describe('reducer', () => {
  test('a run starts in C++ with a full shuffled deck', () => {
    const s = start();
    expect(s.lang).toBe('cpp');
    expect(s.phase).toBe('question');
    expect(new Set(s.deck).size).toBe(SNIPPETS.length);
    expect(s.options).toContain(currentSnippet(s).answer);
  });

  test('ignores a choice that is not on screen', () => {
    const s = start();
    const hidden = ORDER.find((id) => !s.options.includes(id))!;
    expect(reducer(s, { type: 'answer', choice: hidden, now: 0 })).toBe(s);
  });

  test('scores speed and steps the multiplier every four in a row', () => {
    let s = start();
    const gains: number[] = [];
    for (let i = 0; i < 9; i++) {
      s = answerRight(s);
      gains.push(s.gained);
      s = next(s);
    }
    expect(gains).toEqual([200, 200, 200, 200, 400, 400, 400, 400, 600]);
    expect(s.score).toBe(3000);
    expect(s.limitMs).toBe(timeLimit(9));
  });

  test('a slow answer earns only the base points', () => {
    const s = answerRight(start(), timeLimit(0));
    expect(s.gained).toBe(100);
  });

  test('a timeout costs a life and the streak', () => {
    let s = next(answerRight(start()));
    s = reducer(s, { type: 'timeout' });
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.streak).toBe(0);
    expect(s.bestStreak).toBe(1);
  });

  test('the run ends after the last life', () => {
    let s = start();
    for (let i = 0; i < START_LIVES; i++) s = next(answerWrong(s));
    expect(s.phase).toBe('over');
  });

  test('the deck reshuffles after every snippet has been shown', () => {
    let s = start();
    for (let i = 0; i < SNIPPETS.length + 5; i++) s = next(answerRight(s));
    expect(s.phase).toBe('question');
    expect(s.pos).toBe(5);
  });

  test('limits are bounded', () => {
    expect(timeLimit(1000)).toBe(MIN_TIME_MS);
    expect(multiplier(1000)).toBe(4);
  });
});
