import type { ComplexityId, Lang } from '../data/types';
import { COMPLEXITIES } from '../data/complexities';
import { SNIPPETS } from '../data/snippets';

export const START_LIVES = 3;
export const START_TIME_MS = 15_000;
export const MIN_TIME_MS = 7_000;
export const TIME_STEP_MS = 500;
export const STREAK_STEP = 4;
export const MAX_MULTIPLIER = 4;
export const BASE_POINTS = 100;
export const SPEED_POINTS = 100;
export const OPTION_COUNT = 4;
const DISTRACTOR_POOL = 5;

export type Phase = 'idle' | 'question' | 'reveal' | 'over';

export interface GameState {
  phase: Phase;
  lang: Lang;
  deck: number[];
  pos: number;
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  answered: number;
  correct: number;
  limitMs: number;
  startedAt: number;
  options: ComplexityId[];
  choice: ComplexityId | null;
  timedOut: boolean;
  gained: number;
}

export type GameAction =
  | { type: 'setLang'; lang: Lang }
  | { type: 'start'; now: number }
  | { type: 'answer'; choice: ComplexityId; now: number }
  | { type: 'timeout' }
  | { type: 'next'; now: number }
  | { type: 'end' }
  | { type: 'reset' };

export const timeLimit = (answered: number) =>
  Math.max(MIN_TIME_MS, START_TIME_MS - TIME_STEP_MS * answered);

export const multiplier = (streak: number) =>
  Math.min(MAX_MULTIPLIER, 1 + Math.floor(streak / STREAK_STEP));

function shuffledDeck(avoidFirst?: number): number[] {
  const deck = SNIPPETS.map((_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  if (avoidFirst !== undefined && deck.length > 1 && deck[0] === avoidFirst) {
    [deck[0], deck[1]] = [deck[1], deck[0]];
  }
  return deck;
}

const ORDER = COMPLEXITIES.map((c) => c.id);

/**
 * The answer plus three distractors drawn from the classes closest to it, so the
 * choices stay plausible. Returned cheapest-first so the layout is predictable.
 */
export function pickOptions(answer: ComplexityId): ComplexityId[] {
  const at = ORDER.indexOf(answer);
  const nearest = ORDER.filter((id) => id !== answer)
    .map((id) => ({ id, d: Math.abs(ORDER.indexOf(id) - at) + Math.random() * 0.5 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, DISTRACTOR_POOL)
    .map((x) => x.id);
  for (let i = nearest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nearest[i], nearest[j]] = [nearest[j], nearest[i]];
  }
  const picked = new Set([answer, ...nearest.slice(0, OPTION_COUNT - 1)]);
  return ORDER.filter((id) => picked.has(id));
}

export const initialState = (lang: Lang = 'cpp'): GameState => ({
  phase: 'idle',
  lang,
  deck: [],
  pos: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lives: START_LIVES,
  answered: 0,
  correct: 0,
  limitMs: START_TIME_MS,
  startedAt: 0,
  options: [],
  choice: null,
  timedOut: false,
  gained: 0,
});

export const currentSnippet = (s: GameState) => SNIPPETS[s.deck[s.pos]];

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'setLang':
      return { ...state, lang: action.lang };

    case 'start': {
      const deck = shuffledDeck();
      return {
        ...initialState(state.lang),
        phase: 'question',
        deck,
        options: pickOptions(SNIPPETS[deck[0]].answer),
        limitMs: timeLimit(0),
        startedAt: action.now,
      };
    }

    case 'answer': {
      if (state.phase !== 'question' || !state.options.includes(action.choice)) return state;
      const remaining = Math.max(0, state.limitMs - (action.now - state.startedAt));
      const ok = action.choice === currentSnippet(state).answer;
      if (ok) {
        const gained = Math.round(
          (BASE_POINTS + (SPEED_POINTS * remaining) / state.limitMs) * multiplier(state.streak),
        );
        const streak = state.streak + 1;
        return {
          ...state,
          phase: 'reveal',
          choice: action.choice,
          timedOut: false,
          gained,
          score: state.score + gained,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          correct: state.correct + 1,
          answered: state.answered + 1,
        };
      }
      return {
        ...state,
        phase: 'reveal',
        choice: action.choice,
        timedOut: false,
        gained: 0,
        streak: 0,
        lives: state.lives - 1,
        answered: state.answered + 1,
      };
    }

    case 'timeout':
      if (state.phase !== 'question') return state;
      return {
        ...state,
        phase: 'reveal',
        choice: null,
        timedOut: true,
        gained: 0,
        streak: 0,
        lives: state.lives - 1,
        answered: state.answered + 1,
      };

    case 'next': {
      if (state.phase !== 'reveal') return state;
      if (state.lives <= 0) return { ...state, phase: 'over' };
      let { deck, pos } = state;
      pos += 1;
      if (pos >= deck.length) {
        deck = shuffledDeck(deck[deck.length - 1]);
        pos = 0;
      }
      return {
        ...state,
        phase: 'question',
        deck,
        pos,
        options: pickOptions(SNIPPETS[deck[pos]].answer),
        choice: null,
        timedOut: false,
        gained: 0,
        limitMs: timeLimit(state.answered),
        startedAt: action.now,
      };
    }

    case 'end':
      return state.phase === 'idle' ? state : { ...state, phase: 'over' };

    case 'reset':
      return initialState(state.lang);
  }
}
