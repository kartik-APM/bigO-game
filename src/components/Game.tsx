import { useEffect, useId, useReducer, useRef, useState } from 'react';
import { LANGS, type ComplexityId } from '../data/types';
import {
  BASE_POINTS,
  MAX_MULTIPLIER,
  MIN_TIME_MS,
  OPTION_COUNT,
  SPEED_POINTS,
  START_LIVES,
  START_TIME_MS,
  STREAK_STEP,
  TIME_STEP_MS,
  currentSnippet,
  initialState,
  multiplier,
  reducer,
} from '../game/engine';
import { saveScore, type ScoreEntry } from '../lib/scores';
import { CodeView } from './CodeView';
import { HighScores } from './HighScores';

const BAR_WIDTH = 16;
const langLabel = (id: string) => LANGS.find((l) => l.id === id)?.label ?? id;

interface Props {
  scores: ScoreEntry[];
  onScores: (next: ScoreEntry[]) => void;
}

export function Game({ scores, onScores }: Props) {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const [remaining, setRemaining] = useState(START_TIME_MS);
  const [announcement, setAnnouncement] = useState('');
  const [name, setName] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const interacted = useRef(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const overRef = useRef<HTMLHeadingElement>(null);
  const nameId = useId();

  const { phase } = state;
  const snippet = phase === 'idle' ? null : currentSnippet(state);

  // countdown
  useEffect(() => {
    if (phase !== 'question') return;
    const tick = () => {
      const left = state.limitMs - (performance.now() - state.startedAt);
      setRemaining(Math.max(0, left));
      if (left <= 0) dispatch({ type: 'timeout' });
    };
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [phase, state.startedAt, state.limitMs]);

  // number keys answer while a question is open
  const { options } = state;
  useEffect(() => {
    if (phase !== 'question') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const idx = Number(e.key) - 1;
      if (Number.isInteger(idx) && idx >= 0 && idx < options.length) {
        e.preventDefault();
        dispatch({ type: 'answer', choice: options[idx], now: performance.now() });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, options]);

  // focus follows the run
  useEffect(() => {
    if (!interacted.current) return;
    if (phase === 'question') questionRef.current?.focus();
    else if (phase === 'reveal') nextRef.current?.focus();
    else if (phase === 'over') overRef.current?.focus();
    else startRef.current?.focus();
  }, [phase, state.pos, state.deck]);

  // spoken result
  useEffect(() => {
    if (phase !== 'reveal' || !snippet) return;
    const ok = state.choice === snippet.answer;
    const lives = `${state.lives} ${state.lives === 1 ? 'life' : 'lives'} left.`;
    setAnnouncement(
      ok
        ? `Correct, plus ${state.gained} points.`
        : `${state.timedOut ? 'Time is up.' : 'Not quite.'} The answer is ${snippet.answer}. ${lives}`,
    );
  }, [phase, state.answered]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    interacted.current = true;
    setSavedAt(null);
    setAnnouncement('');
    dispatch({ type: 'start', now: performance.now() });
  };
  const answer = (choice: ComplexityId) =>
    dispatch({ type: 'answer', choice, now: performance.now() });
  const next = () => dispatch({ type: 'next', now: performance.now() });
  const end = () => {
    interacted.current = true;
    dispatch({ type: 'end' });
  };
  const reset = () => {
    interacted.current = true;
    dispatch({ type: 'reset' });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const at = Date.now();
    onScores(
      saveScore({
        name: name.trim().slice(0, 20) || 'anonymous',
        score: state.score,
        correct: state.correct,
        answered: state.answered,
        lang: state.lang,
        at,
      }),
    );
    setSavedAt(at);
  };

  if (phase === 'idle') {
    return (
      <div className="game">
        <fieldset className="langs">
          <legend className="label muted">language</legend>
          <div className="langs__opts">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="btn"
                aria-pressed={state.lang === l.id}
                onClick={() => dispatch({ type: 'setLang', lang: l.id })}
              >
                {l.label}
              </button>
            ))}
          </div>
        </fieldset>

        <dl className="spec">
          <div>
            <dt>timer</dt>
            <dd>
              {START_TIME_MS / 1000}s per snippet, {TIME_STEP_MS / 1000}s less each round, never
              under {MIN_TIME_MS / 1000}s
            </dd>
          </div>
          <div>
            <dt>choices</dt>
            <dd>{OPTION_COUNT} per snippet: the answer and its nearest neighbours</dd>
          </div>
          <div>
            <dt>lives</dt>
            <dd>{START_LIVES}. A wrong pick or a timeout costs one.</dd>
          </div>
          <div>
            <dt>streak</dt>
            <dd>
              every {STREAK_STEP} correct in a row adds ×1, up to ×{MAX_MULTIPLIER}
            </dd>
          </div>
          <div>
            <dt>points</dt>
            <dd>
              {BASE_POINTS} + up to {SPEED_POINTS} for speed, times the multiplier
            </dd>
          </div>
          <div>
            <dt>keys</dt>
            <dd>1–{OPTION_COUNT} picks an answer, Enter moves on</dd>
          </div>
        </dl>

        <div className="actions">
          <button ref={startRef} type="button" className="btn btn--primary" onClick={start}>
            start run
          </button>
        </div>

        <HighScores scores={scores} />
      </div>
    );
  }

  if (phase === 'over') {
    return (
      <div className="game">
        <h3 ref={overRef} tabIndex={-1} className="game__head">
          run complete
        </h3>
        <dl className="spec">
          <div>
            <dt>score</dt>
            <dd>
              <strong>{state.score.toLocaleString()}</strong>
            </dd>
          </div>
          <div>
            <dt>correct</dt>
            <dd>
              {state.correct} of {state.answered}
            </dd>
          </div>
          <div>
            <dt>streak</dt>
            <dd>best run of {state.bestStreak}</dd>
          </div>
          <div>
            <dt>language</dt>
            <dd>{langLabel(state.lang)}</dd>
          </div>
        </dl>

        {savedAt === null ? (
          <form className="save" onSubmit={save}>
            <label htmlFor={nameId} className="label muted">
              name for the high-score list
            </label>
            <div className="save__row">
              <input
                id={nameId}
                className="field"
                value={name}
                maxLength={20}
                autoComplete="nickname"
                placeholder="anonymous"
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit" className="btn">
                save score
              </button>
            </div>
          </form>
        ) : (
          <p className="save__done" role="status">
            Saved in this browser.
          </p>
        )}

        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={start}>
            play again
          </button>
          <button type="button" className="btn" onClick={reset}>
            change language
          </button>
        </div>

        <HighScores scores={scores} highlight={savedAt} />
      </div>
    );
  }

  // question or reveal
  const s = snippet!;
  const revealing = phase === 'reveal';
  const ok = revealing && state.choice === s.answer;
  const shown = revealing ? 0 : Math.min(remaining, state.limitMs);
  const filled = Math.max(0, Math.min(BAR_WIDTH, Math.ceil((shown / state.limitMs) * BAR_WIDTH)));
  const low = !revealing && shown < 3000;

  return (
    <div className="game">
      <dl className="hud" aria-label="run status">
        <div>
          <dt>score</dt>
          <dd>
            <strong>{state.score.toLocaleString()}</strong>
          </dd>
        </div>
        <div>
          <dt>streak</dt>
          <dd>
            {state.streak} · ×{multiplier(state.streak)}
          </dd>
        </div>
        <div>
          <dt>lives</dt>
          <dd>
            {state.lives}/{START_LIVES}
          </dd>
        </div>
        <div className={`hud__time${low ? ' is-low' : ''}`}>
          <dt>time</dt>
          <dd>
            <span aria-hidden="true" className="hud__bar">
              [{'#'.repeat(filled)}
              {'.'.repeat(BAR_WIDTH - filled)}]
            </span>{' '}
            {revealing ? 'paused' : `${(shown / 1000).toFixed(1)}s`}
          </dd>
        </div>
      </dl>

      <h3 ref={questionRef} tabIndex={-1} className="game__head">
        snippet {state.answered + (revealing ? 0 : 1)}{' '}
        <span className="muted">· {langLabel(state.lang)}</span>
      </h3>

      <CodeView code={s.code[state.lang]} lang={langLabel(state.lang)} />

      <fieldset className="answers">
        <legend className="label muted">
          pick the time complexity · keys 1–{options.length}
        </legend>
        <div className="answers__grid">
          {options.map((id, i) => {
            const isAnswer = revealing && id === s.answer;
            const isWrong = revealing && id === state.choice && !ok;
            return (
              <button
                key={id}
                type="button"
                className={`btn answers__btn${isAnswer ? ' is-answer' : ''}${isWrong ? ' is-wrong' : ''}`}
                disabled={revealing}
                aria-keyshortcuts={String(i + 1)}
                onClick={() => answer(id)}
              >
                <span className="answers__key" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  {id}
                  {isAnswer && <span className="answers__tag"> · answer</span>}
                  {isWrong && <span className="answers__tag"> · your pick</span>}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {revealing && (
        <div className="verdict">
          <p>
            <strong>
              {ok ? `correct · +${state.gained}` : state.timedOut ? 'time is up' : 'not quite'}
            </strong>
            {!ok && <> · the answer is {s.answer}</>}
          </p>
          <p className="muted">{s.title}</p>
          <p>{s.why}</p>
          <div className="actions">
            <button ref={nextRef} type="button" className="btn btn--primary" onClick={next}>
              {state.lives > 0 ? 'next snippet' : 'see results'}
            </button>
            {state.lives > 0 && (
              <button type="button" className="btn" onClick={end}>
                end run
              </button>
            )}
          </div>
        </div>
      )}

      {!revealing && (
        <div className="actions actions--quiet">
          <button type="button" className="btn" onClick={end}>
            end run
          </button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
