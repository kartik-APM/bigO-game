import { COMPLEXITIES } from '../data/complexities';
import { LANGS } from '../data/types';
import { SNIPPETS } from '../data/snippets';
import { START_LIVES } from '../game/engine';
import type { MyBest } from '../lib/leaderboard';
import { Shapes } from './Shapes';

interface Props {
  /** best practice score saved in this browser */
  practiceBest: number | null;
  /** when signed in, the ranked best replaces the practice best */
  signedIn: boolean;
  rankedBest: MyBest | null;
}

export function Hero({ practiceBest, signedIn, rankedBest }: Props) {
  return (
    <section className="hero" aria-labelledby="title">
      <div className="hero__body">
        <div className="hero__text">
          <h1 id="title">
            Big O <strong>Drill</strong>
          </h1>
          <p className="lede">
            Read a snippet and name its time complexity before the timer runs out. A streak of
            right answers multiplies your score. There are {SNIPPETS.length} snippets in C++, Python,
            JavaScript and Java, and a cheat sheet for when you get stuck.
          </p>
          <div className="actions">
            <a className="btn btn--primary" href="#play">
              start drilling
            </a>
            <a className="btn" href="#cheat-sheet">
              open cheat sheet
            </a>
          </div>
        </div>
        <Shapes />
      </div>
      <dl className="facts" aria-label="at a glance">
        <div>
          <dt>snippets</dt>
          <dd>{SNIPPETS.length}</dd>
        </div>
        <div>
          <dt>languages</dt>
          <dd>{LANGS.length}</dd>
        </div>
        <div>
          <dt>classes</dt>
          <dd>{COMPLEXITIES.length}</dd>
        </div>
        <div>
          <dt>lives</dt>
          <dd>{START_LIVES}</dd>
        </div>
        {signedIn ? (
          <div>
            <dt>ranked best</dt>
            <dd>
              {rankedBest === null ? (
                '–'
              ) : (
                <>
                  <strong>{rankedBest.score.toLocaleString()}</strong> · #{rankedBest.rank}
                </>
              )}
            </dd>
          </div>
        ) : (
          <div>
            <dt>your best</dt>
            <dd>{practiceBest === null ? '–' : <strong>{practiceBest.toLocaleString()}</strong>}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
