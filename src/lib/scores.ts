import type { Lang } from '../data/types';

export interface ScoreEntry {
  name: string;
  score: number;
  correct: number;
  answered: number;
  lang: Lang;
  at: number;
}

const KEY = 'bigo-drill:scores';
const LIMIT = 10;

const isEntry = (v: unknown): v is ScoreEntry => {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.name === 'string' &&
    typeof e.score === 'number' &&
    typeof e.correct === 'number' &&
    typeof e.answered === 'number' &&
    typeof e.lang === 'string' &&
    typeof e.at === 'number'
  );
};

const rank = (list: ScoreEntry[]) =>
  [...list].sort((a, b) => b.score - a.score || a.at - b.at).slice(0, LIMIT);

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? rank(parsed.filter(isEntry)) : [];
  } catch {
    return [];
  }
}

export function saveScore(entry: ScoreEntry): ScoreEntry[] {
  const next = rank([...loadScores(), entry]);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage may be full or disabled; keep the in-memory list
  }
  return next;
}
