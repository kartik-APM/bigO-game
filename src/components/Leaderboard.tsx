import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { LANGS } from '../data/types';
import { fetchLeaderboard, fetchMyBest, type BoardEntry, type MyBest } from '../lib/leaderboard';

const langLabel = (id: string) => LANGS.find((l) => l.id === id)?.label ?? id;
const day = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

export type BoardState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; entries: BoardEntry[]; myBest: MyBest | null };

interface ViewProps {
  state: BoardState;
  signedIn: boolean;
  onRefresh: () => void;
}

/** Pure rendering of the leaderboard; data loading lives in <Leaderboard>. */
export function LeaderboardView({ state, signedIn, onRefresh }: ViewProps) {
  const refresh = (
    <button type="button" className="btn" onClick={onRefresh} disabled={state.status === 'loading'}>
      {state.status === 'error' ? 'try again' : 'refresh'}
    </button>
  );

  if (state.status === 'loading') {
    return (
      <p className="muted" role="status">
        loading the leaderboard…
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="board">
        <p role="alert">
          Couldn’t load the leaderboard. <span className="muted">{state.message}</span>
        </p>
        <div className="actions">{refresh}</div>
      </div>
    );
  }

  const { entries, myBest } = state;
  const inTop = entries.some((e) => e.is_me);

  return (
    <div className="board">
      {entries.length === 0 ? (
        <p className="muted">No ranked scores yet.</p>
      ) : (
        <ol className="scores__list board__list">
          {entries.map((e) => (
            <li key={`${e.rank}-${e.display_name}-${e.finished_at}`} className={e.is_me ? 'is-me' : undefined}>
              <span className="scores__rank">{String(e.rank).padStart(2, '0')}</span>
              <span className="scores__name">
                {e.display_name}
                {e.is_me && <span className="board__you"> · you</span>}
              </span>
              <span className="scores__pts">{e.score.toLocaleString()}</span>
              <span className="scores__meta">
                {e.correct}/{e.answered} · {langLabel(e.lang)} · {day(e.finished_at)}
              </span>
            </li>
          ))}
        </ol>
      )}

      {signedIn && myBest && !inTop && (
        <p className="board__mine">
          your best: <strong>#{myBest.rank}</strong> · {myBest.score.toLocaleString()} ·{' '}
          {langLabel(myBest.lang)}
        </p>
      )}
      {signedIn && !myBest && <p className="board__mine muted">You have no ranked score yet.</p>}

      <div className="actions">{refresh}</div>
    </div>
  );
}

/** Loads the public top 10, plus the caller's own best when signed in. */
export function Leaderboard() {
  const { user } = useAuth();
  const [state, setState] = useState<BoardState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const [entries, myBest] = await Promise.all([fetchLeaderboard(), user ? fetchMyBest() : null]);
      setState({ status: 'ready', entries, myBest });
    } catch (e) {
      setState({ status: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return <LeaderboardView state={state} signedIn={user !== null} onRefresh={() => void load()} />;
}
