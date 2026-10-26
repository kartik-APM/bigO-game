#!/usr/bin/env node
// Syntax-checks every snippet with each language's real toolchain:
//   C++ (clang++/g++), Java (javac), Python (python3), JavaScript (node).
// Snippets are bare functions, so each is wrapped before checking. A snippet may
// call a helper it only describes in a comment ("// permutations(...)"); the
// wrappers supply a stub for those. A missing toolchain is skipped locally but
// fails under CI.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SNIPPETS = join(ROOT, 'snippets');
const IN_CI = Boolean(process.env.CI);

const ids = readdirSync(SNIPPETS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
const file = (id, name) => join(SNIPPETS, id, name);
const read = (id, name) => readFileSync(file(id, name), 'utf8');
const ident = (id) => id.replace(/[^a-zA-Z0-9]/g, '_');
const rel = (p) => relative(ROOT, p);

const tmp = mkdtempSync(join(tmpdir(), 'bigo-snippets-'));
const failures = [];
const skipped = [];

function firstWorking(candidates, versionArg) {
  return candidates.find((cmd) => cmd && spawnSync(cmd, [versionArg], { stdio: 'ignore' }).status === 0);
}

function report(lang, ok, output = '') {
  if (ok) console.log(`ok    ${lang} (${ids.length} snippets)`);
  else failures.push(`${lang}\n${output.trim()}`);
}

function skip(lang, tool) {
  const message = `${lang}: ${tool} not found`;
  if (IN_CI) failures.push(message);
  else {
    skipped.push(message);
    console.log(`skip  ${message}`);
  }
}

// JavaScript: parse only, since some snippets call helpers they describe in comments.
{
  const errors = [];
  for (const id of ids) {
    const path = file(id, 'code.js');
    try {
      new vm.Script(read(id, 'code.js'), { filename: rel(path) });
    } catch (e) {
      errors.push(`${rel(path)}: ${e.message}`);
    }
  }
  report('javascript', errors.length === 0, errors.join('\n'));
}

// Python: compile() each file without writing .pyc files next to the snippets.
{
  const python = firstWorking(['python3', 'python'], '--version');
  if (!python) skip('python', 'python3');
  else {
    const script = [
      'import sys',
      'bad = 0',
      'for f in sys.argv[1:]:',
      '    try:',
      '        compile(open(f, encoding="utf-8").read(), f, "exec")',
      '    except SyntaxError as e:',
      '        bad += 1',
      '        print(f"{f}:{e.lineno}: {e.msg}")',
      'sys.exit(1 if bad else 0)',
    ].join('\n');
    const r = spawnSync(python, ['-c', script, ...ids.map((id) => rel(file(id, 'code.py')))], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    report('python', r.status === 0, r.stdout + r.stderr);
  }
}

// C++: one translation unit, each snippet in its own namespace; #line keeps
// error locations pointing at the real snippet file.
{
  const cxx = firstWorking([process.env.CXX, 'clang++', 'g++'], '--version');
  if (!cxx) skip('cpp', 'clang++ or g++');
  else {
    const prelude = [
      '#include <algorithm>',
      '#include <climits>',
      '#include <cmath>',
      '#include <functional>',
      '#include <queue>',
      '#include <stack>',
      '#include <string>',
      '#include <unordered_map>',
      '#include <unordered_set>',
      '#include <utility>',
      '#include <vector>',
      'using namespace std;',
      'struct Node { int key; Node* left; Node* right; };',
      '',
    ].join('\n');
    const body = ids
      .map((id) => `namespace snippet_${ident(id)} {\n#line 1 "${rel(file(id, 'code.cpp'))}"\n${read(id, 'code.cpp')}}\n`)
      .join('\n');
    const unit = join(tmp, 'all.cpp');
    writeFileSync(unit, prelude + body);
    const r = spawnSync(cxx, ['-std=c++17', '-fsyntax-only', '-Wall', '-Werror', unit], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    report('cpp', r.status === 0, r.stdout + r.stderr);
  }
}

// Java: one wrapper class per snippet, compiled together; line numbers in the
// output are mapped back to the snippet file.
{
  const javac = firstWorking(['javac'], '-version');
  if (!javac) skip('java', 'javac');
  else {
    const stubs = {
      'permutations(': 'List<List<Integer>> permutations(List<Integer> items) { return List.of(); }',
      'nextPermutation(': 'boolean nextPermutation(int[] a) { return false; }',
    };
    const offsets = new Map();
    const paths = ids.map((id) => {
      const code = read(id, 'code.java');
      const header = [
        'import java.util.*;',
        `class Snippet_${ident(id)} {`,
        'static class Node { int key; Node left, right; }',
        ...Object.entries(stubs)
          .filter(([name]) => code.includes(`// ${name}`))
          .map(([, stub]) => stub),
      ];
      offsets.set(`Snippet_${ident(id)}`, { id, lines: header.length });
      const path = join(tmp, `Snippet_${ident(id)}.java`);
      writeFileSync(path, `${header.join('\n')}\n${code}}\n`);
      return path;
    });
    const r = spawnSync(javac, ['-Xlint:none', '-d', join(tmp, 'classes'), ...paths], { encoding: 'utf8' });
    const output = (r.stdout + r.stderr).replace(/^.*?(Snippet_\w+)\.java:(\d+):/gm, (match, cls, line) => {
      const at = offsets.get(cls);
      return at ? `${rel(file(at.id, 'code.java'))}:${Number(line) - at.lines}:` : match;
    });
    report('java', r.status === 0, output);
  }
}

rmSync(tmp, { recursive: true, force: true });

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:\n\n${failures.join('\n\n')}`);
  process.exit(1);
}
console.log(skipped.length ? `\nPassed, with ${skipped.length} toolchain(s) skipped.` : '\nAll snippets compile.');
