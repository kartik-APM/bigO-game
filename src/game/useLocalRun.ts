import { useReducer } from 'react';
import { currentSnippet, initialState, reducer } from './engine';
import type { RunController } from './run';

/** A practice run, played entirely in the browser by the local engine. */
export function useLocalRun(): RunController {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const snippet = state.phase === 'idle' ? null : currentSnippet(state);
  const revealing = state.phase === 'reveal';

  return {
    mode: 'practice',
    phase: state.phase,
    lang: state.lang,
    snippet,
    number: state.answered + (state.phase === 'question' ? 1 : 0),
    options: state.options,
    limitMs: state.limitMs,
    startedAt: state.startedAt,
    score: state.score,
    streak: state.streak,
    bestStreak: state.bestStreak,
    lives: state.lives,
    answered: state.answered,
    correct: state.correct,
    choice: state.choice,
    timedOut: state.timedOut,
    gained: state.gained,
    correctAnswer: revealing && snippet ? snippet.answer : null,
    title: snippet?.title ?? '',
    why: snippet?.why ?? '',
    busy: false,
    error: null,
    retry: null,
    start: (lang) => {
      dispatch({ type: 'setLang', lang });
      dispatch({ type: 'start', now: performance.now() });
    },
    answer: (choice) => dispatch({ type: 'answer', choice, now: performance.now() }),
    timeout: () => dispatch({ type: 'timeout' }),
    next: () => dispatch({ type: 'next', now: performance.now() }),
    end: () => dispatch({ type: 'end' }),
    reset: () => dispatch({ type: 'reset' }),
  };
}
