export type ComplexityId =
  | 'O(1)'
  | 'O(log n)'
  | 'O(√n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n²)'
  | 'O(n³)'
  | 'O(2ⁿ)'
  | 'O(n!)';

export type Lang = 'cpp' | 'python' | 'javascript' | 'java';

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'cpp', label: 'C++' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
];

export interface Snippet {
  id: string;
  title: string;
  answer: ComplexityId;
  why: string;
  code: Record<Lang, string>;
}

export type BaseSnippet = Omit<Snippet, 'code'> & { code: Record<Exclude<Lang, 'cpp'>, string> };

export const clean = (s: string) => s.replace(/^\n/, '').replace(/\s+$/, '');

export function snip(
  id: string,
  title: string,
  answer: ComplexityId,
  why: string,
  python: string,
  javascript: string,
  java: string,
): BaseSnippet {
  return {
    id,
    title,
    answer,
    why,
    code: { python: clean(python), javascript: clean(javascript), java: clean(java) },
  };
}
