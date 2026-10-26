import { describe, expect, test } from 'vitest';
import { pathForSection, pathFromLegacyHash, sectionIdFromPath } from '../src/lib/routes';

describe('sectionIdFromPath', () => {
  test.each([
    ['/', ''],
    ['', ''],
    ['/leaderboard', 'leaderboard'],
    ['/cheat-sheet', 'cheat-sheet'],
    ['/faq/', 'faq'],
    ['//play', 'play'],
  ])('%s → %s', (path, id) => {
    expect(sectionIdFromPath(path)).toBe(id);
  });

  test.each(['/a/b', '/Play', '/with space', '/../etc', '/-x'])('%s is not a section route', (path) => {
    expect(sectionIdFromPath(path)).toBeNull();
  });
});

test('pathForSection', () => {
  expect(pathForSection('')).toBe('/');
  expect(pathForSection('method')).toBe('/method');
});

describe('pathFromLegacyHash', () => {
  const exists = (id: string) => ['play', 'leaderboard', 'faq'].includes(id);

  test('maps old section anchors to paths', () => {
    expect(pathFromLegacyHash('#leaderboard', exists)).toBe('/leaderboard');
  });

  test('leaves other anchors and empty hashes alone', () => {
    expect(pathFromLegacyHash('#main', exists)).toBeNull();
    expect(pathFromLegacyHash('#', exists)).toBeNull();
    expect(pathFromLegacyHash('', exists)).toBeNull();
    expect(pathFromLegacyHash('#access_token=abc', exists)).toBeNull();
  });
});
