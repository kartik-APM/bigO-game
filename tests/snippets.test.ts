import { describe, expect, test } from 'vitest';
import { COMPLEXITIES } from '../src/data/complexities';
import { loadSnippets } from '../src/data/load-snippets';
import { SNIPPETS } from '../src/data/snippets';
import { LANGS } from '../src/data/types';

const MAX_LINE = 100;

describe('snippet library', () => {
  test('ids are unique', () => {
    expect(new Set(SNIPPETS.map((s) => s.id)).size).toBe(SNIPPETS.length);
  });

  test('every complexity class has at least three snippets', () => {
    for (const c of COMPLEXITIES) {
      expect(SNIPPETS.filter((s) => s.answer === c.id).length, c.id).toBeGreaterThanOrEqual(3);
    }
  });

  test.each(SNIPPETS.map((s) => [s.id, s] as const))('%s has readable code in every language', (_, s) => {
    for (const { id: lang } of LANGS) {
      const lines = s.code[lang].split('\n');
      for (const [i, line] of lines.entries()) {
        const where = `${s.id}/${lang}:${i + 1}`;
        expect(line.length, `${where} is longer than ${MAX_LINE} chars`).toBeLessThanOrEqual(MAX_LINE);
        expect(line, `${where} contains a tab`).not.toMatch(/\t/);
        expect(line, `${where} has trailing whitespace`).not.toMatch(/\s$/);
      }
    }
  });
});

describe('loadSnippets', () => {
  const meta = { title: 't', answer: 'O(n)', why: 'w' };
  const fullSources = (id: string) =>
    Object.fromEntries(
      ['code.cpp', 'code.py', 'code.js', 'code.java'].map((f) => [`/snippets/${id}/${f}`, 'x\n']),
    );

  test('loads a complete snippet and trims trailing whitespace', () => {
    const [s] = loadSnippets({ '/snippets/a/meta.json': meta }, fullSources('a'));
    expect(s).toEqual({
      id: 'a',
      ...meta,
      code: { cpp: 'x', python: 'x', javascript: 'x', java: 'x' },
    });
  });

  test('reports a missing language', () => {
    const sources = fullSources('a');
    delete sources['/snippets/a/code.java'];
    expect(() => loadSnippets({ '/snippets/a/meta.json': meta }, sources)).toThrow(/missing code\.java/);
  });

  test('reports an unknown answer', () => {
    expect(() =>
      loadSnippets({ '/snippets/a/meta.json': { ...meta, answer: 'O(n^2)' } }, fullSources('a')),
    ).toThrow(/"answer" must be one of/);
  });

  test('reports stray files, orphan folders and bad names', () => {
    const sources = { ...fullSources('Bad_Name'), '/snippets/orphan/code.py': 'x', '/snippets/Bad_Name/code.rb': 'x' };
    let message = '';
    try {
      loadSnippets({ '/snippets/Bad_Name/meta.json': { answer: 'O(n)' } }, sources);
    } catch (e) {
      message = (e as Error).message;
    }
    expect(message).toMatch(/code\.rb: unexpected file/);
    expect(message).toMatch(/orphan: source files without a meta\.json/);
    expect(message).toMatch(/must be kebab-case/);
    expect(message).toMatch(/"title" must be a non-empty string/);
    expect(message).toMatch(/"why" must be a non-empty string/);
  });
});
