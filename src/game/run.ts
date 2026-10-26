import type { ComplexityId, Lang, Snippet } from '../data/types';
import type { Phase } from './engine';

export type Mode = 'practice' | 'ranked';

/** What the game screens need to draw a run, whichever engine is behind it. */
export interface RunView {
  mode: Mode;
  phase: Phase;
  lang: Lang;
  snippet: Snippet | null;
  /** 1-based number of the snippet on screen */
  number: number;
  options: ComplexityId[];
  limitMs: number;
  /** performance.now() when the current question appeared */
  startedAt: number;
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  answered: number;
  correct: number;
  /** filled in once the answer is revealed */
  choice: ComplexityId | null;
  timedOut: boolean;
  gained: number;
  correctAnswer: ComplexityId | null;
  title: string;
  why: string;
  /** waiting on the server */
  busy: boolean;
  error: string | null;
  /** repeats the call that failed, when that is safe */
  retry: (() => void) | null;
}

export interface RunActions {
  start: (lang: Lang) => void;
  answer: (choice: ComplexityId) => void;
  timeout: () => void;
  next: () => void;
  end: () => void;
  reset: () => void;
}

export type RunController = RunView & RunActions;
