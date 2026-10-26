import { COMPLEXITIES } from '../data/complexities';
import { LANGS } from '../data/types';
import { SNIPPETS } from '../data/snippets';
import { START_LIVES } from '../game/engine';
import { Wordmark } from './Wordmark';

export function Hero({ best }: { best: number | null }) {
  return (
    <section className="hero" aria-labelledby="title">
      <span className="cmd__num" aria-hidden="true" />
      <div className="hero__body">
        <div>
          <Wordmark text="BIG O" />
          <h1 id="title">
            Big O <strong>Drill</strong>
            <span className="cursor" aria-hidden="true" />
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
          <div>
            <dt>your best</dt>
            <dd>{best === null ? '–' : <strong>{best.toLocaleString()}</strong>}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
