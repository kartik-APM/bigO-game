import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { fetchMyBest, type MyBest } from './leaderboard';

/**
 * The signed-in player's best ranked run and rank, or null.
 * Reloads when the user changes or `version` goes up (after a ranked run).
 */
export function useMyBest(version = 0): MyBest | null {
  const { user } = useAuth();
  const [best, setBest] = useState<MyBest | null>(null);

  useEffect(() => {
    if (!user) {
      setBest(null);
      return;
    }
    let current = true;
    fetchMyBest()
      .then((b) => current && setBest(b))
      .catch(() => current && setBest(null));
    return () => {
      current = false;
    };
  }, [user, version]);

  return best;
}
