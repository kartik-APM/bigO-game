import { useId } from 'react';
import { LANGS } from '../data/types';
import type { ScoreEntry } from '../lib/scores';

interface Props {
  scores: ScoreEntry[];
  highlight?: number | null;
}

const langLabel = (id: string) => LANGS.find((l) => l.id === id)?.label ?? id;

export function HighScores({ scores, highlight }: Props) {
  const headId = useId();
  return (
    <section className="scores" aria-labelledby={headId}>
      <h3 id={headId} className="game__head">
        high scores <span className="muted">· this browser</span>
      </h3>
      {scores.length === 0 ? (
        <p className="muted">No scores yet. Finish a run and save it to see it here.</p>
      ) : (
        <ol className="scores__list">
          {scores.map((e, i) => (
            <li key={`${e.at}-${i}`} className={e.at === highlight ? 'is-new' : undefined}>
              <span className="scores__rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="scores__name">{e.name}</span>
              <span className="scores__pts">{e.score.toLocaleString()}</span>
              <span className="scores__meta">
                {e.correct}/{e.answered} · {langLabel(e.lang)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
