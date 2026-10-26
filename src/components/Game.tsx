import { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { LANGS, type ComplexityId, type Lang } from '../data/types';
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
  multiplier,
} from '../game/engine';
import type { Mode, RunController } from '../game/run';
import { useLocalRun } from '../game/useLocalRun';
import { useRankedRun } from '../game/useRankedRun';
import { saveScore, type ScoreEntry } from '../lib/scores';
import { CodeView } from './CodeView';
import { HighScores } from './HighScores';

const BAR_WIDTH = 16;
const langLabel = (id: string) => LANGS.find((l) => l.id === id)?.label ?? id;

interface Props {
  scores: ScoreEntry[];
  onScores: (next: ScoreEntry[]) => void;
  /** called when a ranked run finishes, so the leaderboard can refresh */
  onRankedFinished?: () => void;
}

export function Game({ scores, onScores, onRankedFinished }: Props) {
  const { enabled, user, signIn } = useAuth();
  const canRank = enabled && user !== null;
  const local = useLocalRun();
  const ranked = useRankedRun(onRankedFinished);
  const [lang, setLang] = useState<Lang>('cpp');
  const [mode, setMode] = useState<Mode>('ranked');
  const chosen: Mode = canRank ? mode : 'practice';
  // an active run keeps its engine; otherwise the chosen mode decides
  const run: RunController =
    ranked.phase !== 'idle' ? ranked : local.phase !== 'idle' ? local : chosen === 'ranked' ? ranked : local;

  const [remaining, setRemaining] = useState(START_TIME_MS);
  const [announcement, setAnnouncement] = useState('');
  const [name, setName] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const interacted = useRef(false);
  const runRef = useRef(run);
  runRef.current = run;
  const timedOutFor = useRef<number | null>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const overRef = useRef<HTMLHeadingElement>(null);
  const nameId = useId();

  const { phase } = run;
  const accepting = phase === 'question' && !run.busy && !run.error;

  // countdown; the server keeps its own clock for ranked runs
  useEffect(() => {
    if (!accepting) return;
    const tick = () => {
      const left = run.limitMs - (performance.now() - run.startedAt);
      setRemaining(Math.max(0, left));
      if (left <= 0 && timedOutFor.current !== run.startedAt) {
        timedOutFor.current = run.startedAt;
        runRef.current.timeout();
      }
    };
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [accepting, run.startedAt, run.limitMs, run.mode]);

  // number keys answer while a question is open
  const { options } = run;
  useEffect(() => {
    if (!accepting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const idx = Number(e.key) - 1;
      if (Number.isInteger(idx) && idx >= 0 && idx < options.length) {
        e.preventDefault();
        runRef.current.answer(options[idx]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [accepting, options]);

  // focus follows the run
  useEffect(() => {
    if (!interacted.current) return;
    if (phase === 'question') questionRef.current?.focus();
    else if (phase === 'reveal') nextRef.current?.focus();
    else if (phase === 'over') overRef.current?.focus();
    else startRef.current?.focus();
  }, [phase, run.number, run.mode]);

  // spoken result
  useEffect(() => {
    if (phase !== 'reveal' || !run.correctAnswer) return;
    const ok = run.choice === run.correctAnswer && !run.timedOut;
    const lives = `${run.lives} ${run.lives === 1 ? 'life' : 'lives'} left.`;
    setAnnouncement(
      ok
        ? `Correct, plus ${run.gained} points.`
        : `${run.timedOut ? 'Time is up.' : 'Not quite.'} The answer is ${run.correctAnswer}. ${lives}`,
    );
  }, [phase, run.answered]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = (lng: Lang = lang) => {
    interacted.current = true;
    timedOutFor.current = null;
    setSavedAt(null);
    setAnnouncement('');
    run.start(lng);
  };
  const back = () => {
    interacted.current = true;
    setLang(run.lang);
    run.reset();
  };
  const end = () => {
    interacted.current = true;
    run.end();
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const at = Date.now();
    onScores(
      saveScore({
        name: name.trim().slice(0, 20) || 'anonymous',
        score: run.score,
        correct: run.correct,
        answered: run.answered,
        lang: run.lang,
        at,
      }),
    );
    setSavedAt(at);
  };

  const errorBlock = run.error && (
    <div className="run-error" role="alert">
      <p>{run.error}</p>
      <div className="actions">
        {run.retry && (
          <button type="button" className="btn btn--primary" onClick={run.retry}>
            retry
          </button>
        )}
        {phase !== 'idle' && phase !== 'over' && run.retry === null && (
          <button type="button" className="btn" onClick={back}>
            leave run
          </button>
        )}
      </div>
    </div>
  );

  if (phase === 'idle') {
    return (
      <div className="game">
        {canRank && (
          <fieldset className="langs">
            <legend className="label muted">mode</legend>
            <div className="langs__opts">
              {(['ranked', 'practice'] as const).map((m) => (
                <button key={m} type="button" className="btn" aria-pressed={mode === m} onClick={() => setMode(m)}>
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset className="langs">
          <legend className="label muted">language</legend>
          <div className="langs__opts">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="btn"
                aria-pressed={lang === l.id}
                onClick={() => setLang(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </fieldset>

        <dl className="spec">
          <div>
            <dt>mode</dt>
            <dd>
              {chosen === 'ranked'
                ? 'ranked: timed and scored on the server; your best run counts on the leaderboard'
                : 'practice: scored in this browser; nothing leaves your device'}
            </dd>
          </div>
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

        {enabled && !user && (
          <p className="game__hint">
            <span className="muted">Sign in to play ranked runs that count on the leaderboard. </span>
            <button type="button" className="blink blink--button" onClick={() => void signIn()}>
              sign in with google
            </button>
          </p>
        )}

        {errorBlock}

        <div className="actions">
          <button
            ref={startRef}
            type="button"
            className="btn btn--primary"
            onClick={() => start()}
            disabled={run.busy}
          >
            {run.busy ? 'starting…' : `start ${chosen} run`}
          </button>
        </div>

        {chosen === 'practice' && <HighScores scores={scores} />}
      </div>
    );
  }

  if (phase === 'over') {
    const isRanked = run.mode === 'ranked';
    return (
      <div className="game">
        <h3 ref={overRef} tabIndex={-1} className="game__head">
          {isRanked ? 'ranked run complete' : 'run complete'}
        </h3>
        <dl className="spec">
          <div>
            <dt>score</dt>
            <dd>
              <strong>{run.score.toLocaleString()}</strong>
            </dd>
          </div>
          <div>
            <dt>correct</dt>
            <dd>
              {run.correct} of {run.answered}
            </dd>
          </div>
          <div>
            <dt>streak</dt>
            <dd>best run of {run.bestStreak}</dd>
          </div>
          <div>
            <dt>language</dt>
            <dd>{langLabel(run.lang)}</dd>
          </div>
        </dl>

        {isRanked ? (
          <p className="save__done">
            Scored on the server. Your best ranked run counts on the{' '}
            <a href="#leaderboard">leaderboard</a>.
          </p>
        ) : savedAt === null ? (
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

        {errorBlock}

        <div className="actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => start(run.lang)}
            disabled={run.busy}
          >
            {run.busy ? 'starting…' : 'play again'}
          </button>
          <button type="button" className="btn" onClick={back}>
            change language
          </button>
        </div>

        {!isRanked && <HighScores scores={scores} highlight={savedAt} />}
      </div>
    );
  }

  // question or reveal
  const s = run.snippet;
  const revealing = phase === 'reveal';
  const ok = revealing && run.choice !== null && run.choice === run.correctAnswer && !run.timedOut;
  const shown = revealing || run.busy ? 0 : Math.min(remaining, run.limitMs);
  const filled = Math.max(0, Math.min(BAR_WIDTH, Math.ceil((shown / run.limitMs) * BAR_WIDTH)));
  const low = accepting && shown < 3000;
  const timeText = revealing ? 'paused' : run.busy ? 'checking' : `${(shown / 1000).toFixed(1)}s`;

  return (
    <div className="game">
      <dl className="hud" aria-label="run status">
        <div>
          <dt>score</dt>
          <dd>
            <strong>{run.score.toLocaleString()}</strong>
          </dd>
        </div>
        <div>
          <dt>streak</dt>
          <dd>
            {run.streak} · ×{multiplier(run.streak)}
          </dd>
        </div>
        <div>
          <dt>lives</dt>
          <dd>
            {run.lives}/{START_LIVES}
          </dd>
        </div>
        <div className={`hud__time${low ? ' is-low' : ''}`}>
          <dt>time</dt>
          <dd>
            <span aria-hidden="true" className="hud__bar">
              <span className="hud__fill" style={{ width: `${(filled / BAR_WIDTH) * 100}%` }} />
            </span>{' '}
            {timeText}
          </dd>
        </div>
      </dl>

      <h3 ref={questionRef} tabIndex={-1} className="game__head">
        snippet {run.number} <span className="muted">· {langLabel(run.lang)}</span>
        {run.mode === 'ranked' && <span className="muted"> · ranked</span>}
      </h3>

      {s && <CodeView code={s.code[run.lang]} lang={langLabel(run.lang)} />}

      {s && (
        <fieldset className="answers">
          <legend className="label muted">
            pick the time complexity · keys 1–{options.length}
          </legend>
          <div className="answers__grid">
            {options.map((id: ComplexityId, i) => {
              const isAnswer = revealing && id === run.correctAnswer;
              const isWrong = revealing && id === run.choice && id !== run.correctAnswer;
              const checking = run.busy && id === run.choice;
              return (
                <button
                  key={id}
                  type="button"
                  className={`btn answers__btn${isAnswer ? ' is-answer' : ''}${isWrong ? ' is-wrong' : ''}`}
                  disabled={!accepting}
                  aria-keyshortcuts={String(i + 1)}
                  onClick={() => run.answer(id)}
                >
                  <span className="answers__key" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    {id}
                    {isAnswer && <span className="answers__tag"> · answer</span>}
                    {isWrong && <span className="answers__tag"> · your pick</span>}
                    {checking && <span className="answers__tag"> · checking</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {run.busy && phase === 'question' && (
        <p className="muted run-status" role="status">
          checking your answer…
        </p>
      )}

      {errorBlock}

      {revealing && (
        <div className="verdict">
          <p>
            <strong>
              {ok ? `correct · +${run.gained}` : run.timedOut ? 'time is up' : 'not quite'}
            </strong>
            {!ok && <> · the answer is {run.correctAnswer}</>}
          </p>
          <p className="muted">{run.title}</p>
          <p>{run.why}</p>
          <div className="actions">
            <button ref={nextRef} type="button" className="btn btn--primary" onClick={run.next}>
              {run.lives > 0 ? 'next snippet' : 'see results'}
            </button>
            {run.lives > 0 && (
              <button type="button" className="btn" onClick={end} disabled={run.busy}>
                end run
              </button>
            )}
          </div>
        </div>
      )}

      {!revealing && (
        <div className="actions actions--quiet">
          <button type="button" className="btn" onClick={end} disabled={run.busy}>
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
