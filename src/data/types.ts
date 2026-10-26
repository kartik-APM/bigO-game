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
