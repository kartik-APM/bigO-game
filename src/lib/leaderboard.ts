import type { Lang } from '../data/types';
import { supabase } from './supabase';

export interface BoardEntry {
  rank: number;
  display_name: string;
  score: number;
  correct: number;
  answered: number;
  lang: Lang;
  finished_at: string;
  is_me: boolean;
}

export interface MyBest {
  rank: number;
  score: number;
  correct: number;
  answered: number;
  lang: Lang;
  finished_at: string;
}

/** Top 10 players by best ranked run. Empty when Supabase isn't configured. */
export async function fetchLeaderboard(): Promise<BoardEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('leaderboard');
  if (error) throw new Error(error.message);
  return (data ?? []) as BoardEntry[];
}

/** The signed-in player's best counted run and rank, or null. */
export async function fetchMyBest(): Promise<MyBest | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('my_best');
  if (error) throw new Error(error.message);
  return (data ?? null) as MyBest | null;
}
