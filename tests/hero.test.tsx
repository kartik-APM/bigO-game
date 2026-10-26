import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import { Hero } from '../src/components/Hero';

vi.mock('../src/lib/supabase', () => ({ supabase: null }));

const facts = (html: string) =>
  [...html.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/g)].map(([, dt, dd]) => [
    dt,
    dd.replace(/<[^>]+>/g, '').replace(/<!-- -->/g, ''),
  ]);
const best = (html: string) => facts(html).filter(([dt]) => dt.includes('best'));

describe('Hero "best" fact', () => {
  test('signed out: the practice best from this browser', () => {
    expect(best(renderToStaticMarkup(<Hero practiceBest={1234} signedIn={false} rankedBest={null} />))).toEqual([
      ['your best', '1,234'],
    ]);
    expect(best(renderToStaticMarkup(<Hero practiceBest={null} signedIn={false} rankedBest={null} />))).toEqual([
      ['your best', '–'],
    ]);
  });

  test('signed in: only the ranked best, with its rank', () => {
    const ranked = { rank: 1, score: 550, correct: 4, answered: 7, lang: 'cpp' as const, finished_at: '2026-10-26T08:00:00Z' };
    expect(best(renderToStaticMarkup(<Hero practiceBest={9999} signedIn rankedBest={ranked} />))).toEqual([
      ['ranked best', '550 · #1'],
    ]);
  });

  test('signed in without a ranked run yet', () => {
    expect(best(renderToStaticMarkup(<Hero practiceBest={9999} signedIn rankedBest={null} />))).toEqual([
      ['ranked best', '–'],
    ]);
  });
});
