import { COMPLEXITIES } from './complexities';
import { LANGS, type ComplexityId, type Lang, type Snippet } from './types';

/** File name of each language's source inside a snippet folder. */
export const SOURCE_FILES: Record<Lang, string> = {
  cpp: 'code.cpp',
  python: 'code.py',
  javascript: 'code.js',
  java: 'code.java',
};

const ANSWERS = new Set<string>(COMPLEXITIES.map((c) => c.id));
const LANG_BY_FILE = new Map(LANGS.map((l) => [SOURCE_FILES[l.id], l.id] as const));
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// paths look like "/snippets/<id>/<file>"
const parts = (path: string) => {
  const segs = path.split('/');
  return { id: segs[segs.length - 2], file: segs[segs.length - 1] };
};

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/**
 * Builds the snippet list from snippet folders, collecting every problem
 * (missing language, bad answer, stray file) into one error.
 */
export function loadSnippets(
  metas: Record<string, unknown>,
  sources: Record<string, string>,
): Snippet[] {
  const problems: string[] = [];
  const code = new Map<string, Partial<Record<Lang, string>>>();

  for (const [path, text] of Object.entries(sources)) {
    const { id, file } = parts(path);
    const lang = LANG_BY_FILE.get(file);
    if (!lang) {
      problems.push(`${path}: unexpected file; expected one of ${[...LANG_BY_FILE.keys()].join(', ')}`);
      continue;
    }
    const body = text.replace(/\s+$/, '');
    if (!body) problems.push(`${path}: file is empty`);
    code.set(id, { ...code.get(id), [lang]: body });
  }

  const snippets: Snippet[] = [];
  const seen = new Set<string>();

  for (const [path, raw] of Object.entries(metas)) {
    const { id } = parts(path);
    seen.add(id);
    if (!ID_PATTERN.test(id)) problems.push(`${path}: folder name must be kebab-case`);

    const meta = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
    if (!isText(meta.title)) problems.push(`${path}: "title" must be a non-empty string`);
    if (!isText(meta.why)) problems.push(`${path}: "why" must be a non-empty string`);
    if (typeof meta.answer !== 'string' || !ANSWERS.has(meta.answer)) {
      problems.push(`${path}: "answer" must be one of ${[...ANSWERS].join(', ')}`);
    }

    const files = code.get(id) ?? {};
    const missing = LANGS.filter((l) => !files[l.id]).map((l) => SOURCE_FILES[l.id]);
    if (missing.length) problems.push(`/snippets/${id}: missing ${missing.join(', ')}`);

    snippets.push({
      id,
      title: String(meta.title),
      answer: meta.answer as ComplexityId,
      why: String(meta.why),
      code: files as Record<Lang, string>,
    });
  }

  for (const id of code.keys()) {
    if (!seen.has(id)) problems.push(`/snippets/${id}: source files without a meta.json`);
  }

  if (problems.length) throw new Error(`Invalid snippets:\n  ${problems.join('\n  ')}`);
  return snippets.sort((a, b) => a.id.localeCompare(b.id));
}
