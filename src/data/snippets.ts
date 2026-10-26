import { loadSnippets } from './load-snippets';

// Each folder in /snippets holds meta.json plus one source file per language.
const metas = import.meta.glob('/snippets/*/meta.json', { eager: true, import: 'default' });
const sources = import.meta.glob<string>('/snippets/*/code.*', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export const SNIPPETS = loadSnippets(metas, sources);
