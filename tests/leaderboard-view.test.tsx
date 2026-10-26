import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import { LeaderboardView, type BoardState } from '../src/components/Leaderboard';
import type { BoardEntry } from '../src/lib/leaderboard';

// The view never talks to Supabase; skip creating a real client from .env.local.
vi.mock('../src/lib/supabase', () => ({ supabase: null }));

const entry = (rank: number, name: string, score: number, isMe = false): BoardEntry => ({
  rank,
  display_name: name,
  score,
  correct: 7,
  answered: 9,
  lang: 'cpp',
  finished_at: '2026-10-26T08:00:00Z',
  is_me: isMe,
});

const render = (state: BoardState, signedIn = false) =>
  renderToStaticMarkup(<LeaderboardView state={state} signedIn={signedIn} onRefresh={() => {}} />);

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

describe('LeaderboardView', () => {
  test('loading is announced as a status', () => {
    expect(render({ status: 'loading' })).toMatch(/role="status"[^>]*>loading the leaderboard/);
  });

  test('errors are announced with a retry button', () => {
    const html = render({ status: 'error', message: 'network down' });
    expect(html).toMatch(/role="alert"/);
    expect(text(html)).toContain('Couldn’t load the leaderboard. network down');
    expect(text(html)).toContain('try again');
  });

  test('an empty board says so', () => {
    expect(text(render({ status: 'ready', entries: [], myBest: null }))).toContain('No ranked scores yet.');
  });

  test('rows show rank, full name, score and run details', () => {
    const html = render({
      status: 'ready',
      entries: [entry(1, 'Kartik Kumar Panday', 2400), entry(2, 'Ada Lovelace', 1200)],
      myBest: null,
    });
    const rows = html.match(/<li[^>]*>.*?<\/li>/g)!.map(text);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatch(/^01 Kartik Kumar Panday 2,400 7\/9 · C\+\+ · /);
    expect(rows[1]).toMatch(/^02 Ada Lovelace 1,200/);
  });

  test('the caller’s row is marked, and their separate best line is hidden when they are in the top 10', () => {
    const html = render(
      {
        status: 'ready',
        entries: [entry(1, 'Ada Lovelace', 1200), entry(2, 'Kartik Kumar Panday', 900, true)],
        myBest: { rank: 2, score: 900, correct: 7, answered: 9, lang: 'cpp', finished_at: '2026-10-26T08:00:00Z' },
      },
      true,
    );
    expect(html).toMatch(/<li class="is-me">/);
    expect(text(html)).toContain('Kartik Kumar Panday · you');
    expect(text(html)).not.toContain('your best');
  });

  test('a signed-in player outside the top 10 sees their rank', () => {
    const html = render(
      {
        status: 'ready',
        entries: [entry(1, 'Ada Lovelace', 1200)],
        myBest: { rank: 14, score: 350, correct: 3, answered: 6, lang: 'python', finished_at: '2026-10-26T08:00:00Z' },
      },
      true,
    );
    expect(text(html)).toContain('your best: #14 · 350 · Python');
  });

  test('a signed-in player without a ranked run is told so', () => {
    const html = render({ status: 'ready', entries: [], myBest: null }, true);
    expect(text(html)).toContain('You have no ranked score yet.');
  });
});
