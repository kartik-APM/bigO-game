import { clean, type Snippet } from '../types';
import { CONSTANT } from './constant';
import { LOGARITHMIC } from './logarithmic';
import { ROOT } from './root';
import { LINEAR } from './linear';
import { LINEARITHMIC } from './linearithmic';
import { QUADRATIC } from './quadratic';
import { CUBIC } from './cubic';
import { EXPONENTIAL } from './exponential';
import { FACTORIAL } from './factorial';
import { CPP_SIMPLE } from './cpp-simple';
import { CPP_HEAVY } from './cpp-heavy';

const CPP: Record<string, string> = { ...CPP_SIMPLE, ...CPP_HEAVY };

export const SNIPPETS: Snippet[] = [
  ...CONSTANT,
  ...LOGARITHMIC,
  ...ROOT,
  ...LINEAR,
  ...LINEARITHMIC,
  ...QUADRATIC,
  ...CUBIC,
  ...EXPONENTIAL,
  ...FACTORIAL,
].map((s) => {
  const cpp = CPP[s.id];
  if (!cpp) throw new Error(`missing C++ version for snippet "${s.id}"`);
  return { ...s, code: { ...s.code, cpp: clean(cpp) } };
});
