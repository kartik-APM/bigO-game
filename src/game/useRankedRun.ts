import { useCallback, useReducer, useRef, useState } from 'react';
import type { ComplexityId, Lang } from '../data/types';
import { endRun, startRun, submitAnswer } from '../lib/ranked';
import { initialRankedState, rankedReducer, rankedView } from './ranked-state';
import type { RunController } from './run';

/**
 * A ranked run played through the server. Every call can be retried safely:
 * the server returns the stored result if an answer was already recorded.
 */
export function useRankedRun(onFinished?: () => void): RunController {
  const [state, dispatch] = useReducer(rankedReducer, undefined, () => initialRankedState());
  const [retry, setRetry] = useState<(() => void) | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const finished = useRef(onFinished);
  finished.current = onFinished;

  const call = useCallback((task: () => Promise<void>, choice?: ComplexityId | null) => {
    const attempt = () => {
      dispatch(choice === undefined ? { type: 'request' } : { type: 'request', choice });
      setRetry(null);
      task().catch((e: unknown) => {
        dispatch({ type: 'failed', message: e instanceof Error ? e.message : String(e) });
        setRetry(() => attempt);
      });
    };
    attempt();
  }, []);

  const send = useCallback(
    (choice: ComplexityId | null) => {
      const s = stateRef.current;
      if (s.phase !== 'question' || s.busy || s.error || !s.runId || !s.question) return;
      const { runId, question } = s;
      call(async () => {
        const response = await submitAnswer(runId, question.n, choice);
        dispatch({ type: 'answered', response });
        if (response.final) finished.current?.();
      }, choice);
    },
    [call],
  );

  const view = rankedView(state);

  return {
    ...view,
    retry: state.error ? retry : null,
    start: (lang: Lang) => {
      if (stateRef.current.busy) return;
      call(async () => {
        const run = await startRun(lang);
        dispatch({ type: 'started', lang, run, now: performance.now() });
      });
    },
    answer: (choice) => send(choice),
    timeout: () => send(null),
    next: () => dispatch({ type: 'advance', now: performance.now() }),
    end: () => {
      const s = stateRef.current;
      if (s.phase === 'idle' || s.phase === 'over' || s.busy) return;
      if (s.final) {
        dispatch({ type: 'advance', now: performance.now() });
        return;
      }
      if (!s.runId) return;
      const runId = s.runId;
      call(async () => {
        const { final } = await endRun(runId);
        dispatch({ type: 'ended', final });
        finished.current?.();
      });
    },
    reset: () => {
      setRetry(null);
      dispatch({ type: 'reset' });
    },
  };
}
