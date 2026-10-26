# Big O Drill

A timed practice game for reading code and naming its time complexity.

Each round shows a snippet in C++, Python, JavaScript or Java and offers four
choices. Answer before the clock runs out; a streak of right answers multiplies
your score. A cheat sheet, a short method for analysing code, and an FAQ sit
below the game.

- **100 snippets** across nine classes: O(1), O(log n), O(√n), O(n), O(n log n),
  O(n²), O(n³), O(2ⁿ) and O(n!)
- **4 languages**, with C++ as the default
- **4 choices per round**: the answer plus three nearby classes, so the wrong
  options are plausible
- **3 lives**. The timer starts at 15 s and drops 0.5 s each round, down to 7 s.
- High scores are stored in the browser (`localStorage`); there is no backend.
- Fully keyboard playable: keys `1`–`4` answer, `Enter` moves on.

## Getting started

Requires Node 20+.

```sh
npm install
npm run dev        # http://localhost:5173
```

| Script                   | What it does                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Start the Vite dev server                                          |
| `npm run build`          | Typecheck and build to `dist/`                                     |
| `npm run preview`        | Serve the production build                                         |
| `npm test`               | Unit tests (Vitest): snippet library, loader, game engine          |
| `npm run check:snippets` | Compile every snippet with clang++/g++, javac, Python and Node     |
| `npm run check`          | All of the above: typecheck, tests, snippet checks, build          |

## Project layout

```
snippets/                  one folder per snippet (content, not code)
  merge-sort/
    meta.json              title, answer, explanation
    code.cpp  code.py  code.java  code.js
src/
  data/
    complexities.ts        the nine classes shown in the cheat sheet
    load-snippets.ts       validates snippet folders and builds the list
    snippets.ts            loads /snippets at build time via import.meta.glob
  game/engine.ts           pure game state: deck, options, timer limits, scoring
  lib/scores.ts            high scores in localStorage
  components/              Hero, Game, CodeView, CheatSheet, Method, Faq, …
  styles.css               terminal theme (design tokens in :root)
scripts/check-snippets.mjs compiles every snippet in every language
tests/                     Vitest suites
.github/workflows/ci.yml   runs `check` steps on every push and pull request
```

## Adding a snippet

1. Create a kebab-case folder under `snippets/`, e.g. `snippets/two-pointer-merge/`.
2. Add `meta.json`:

   ```json
   {
     "title": "merge two sorted lists",
     "answer": "O(n)",
     "why": "Every element is copied exactly once, so the work is linear in the total input."
   }
   ```

   `answer` must match a class in `src/data/complexities.ts` exactly
   (`O(1)`, `O(log n)`, `O(√n)`, `O(n)`, `O(n log n)`, `O(n²)`, `O(n³)`, `O(2ⁿ)`, `O(n!)`).

3. Add all four sources: `code.cpp`, `code.py`, `code.java` and `code.js`.
4. Run `npm run check`.

The loader fails the build if a folder is missing a language, has an unknown
answer, or contains an unexpected file.

### Snippet conventions

- Write bare functions only: no `main`, no class wrappers. Leave out includes,
  imports and `using namespace std;`; the checker adds them.
- Keep lines at 100 characters or fewer, with no tabs and no trailing
  whitespace.
- The answer is the **worst case**. Hash operations count as average O(1), and
  arithmetic counts as O(1).
- If a snippet calls a helper it doesn't define, describe the helper in a
  comment, e.g. `// permutations(list) returns every ordering of list`. The Java
  checker supplies stubs for `permutations` and `nextPermutation` when it sees
  those comments; C++ code should use the standard library instead.
- Keep every language version logically the same, so the answer doesn't
  depend on the language.

## How the snippet check works

`scripts/check-snippets.mjs` syntax-checks each language with its real toolchain:

| Language   | Tool               | How                                                                 |
| ---------- | ------------------ | ------------------------------------------------------------------- |
| C++        | `clang++` / `g++`  | Every snippet in its own namespace in one file, `-Wall -Werror`      |
| Java       | `javac`            | Each snippet wrapped in its own class; error lines mapped back       |
| Python     | `python3`          | `compile()` on each file (no `.pyc` written)                         |
| JavaScript | `node`             | Parsed with `vm.Script`                                              |

Errors point at the real file, e.g. `snippets/gauss/code.cpp:4:21`. A missing
toolchain is skipped locally with a warning but fails the run in CI.

## Design

The UI follows a terminal style: IBM Plex Mono (loaded under the `TerminalPlex`
alias), green on black, with white reserved for emphasis. Sections are laid out
as numbered commands, each followed by its output. Spacing and widths are
measured in character units. The tokens live at the top of `src/styles.css`.
It respects `prefers-reduced-motion`, keeps focus visible, and has no
horizontal scrolling down to 375 px wide.

## Credits

All snippets and explanations are original to this project. The font is
IBM Plex Mono, licensed under the SIL Open Font License.
