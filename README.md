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
- **Practice** runs are scored in the browser, with high scores kept in `localStorage`.
- **Ranked** runs (optional, after Google sign-in) are timed and scored on the
  server, and each player's best one appears on a public top-10 leaderboard.
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
| `npm run db:answers`     | Regenerate `supabase/answers.sql` from `snippets/*/meta.json`      |
| `npm run check`          | All of the above: typecheck, tests, snippet checks, answer-key sync, build |

## Sign in (optional)

Google sign-in through [Supabase](https://supabase.com) is optional. Without it
the app runs guest-only and the sign-in link is hidden.

1. Create a Supabase project. In Authentication → Providers → Google, enable
   Google with a Google Cloud OAuth client of type "Web application". Its
   authorised redirect URI is `https://<project-ref>.supabase.co/auth/v1/callback`.
2. In Supabase Authentication → URL Configuration, set the Site URL to your
   deployed URL. Add `http://localhost:5173` as a redirect URL.
3. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API). Restart `npm run dev`.

Only the anon (publishable) key belongs in the frontend. Never commit `.env.local`
or a service-role key.

Once you're signed in, the start screen offers **ranked** or **practice**. A
ranked run calls the server for every question; while it waits, the pick shows
"· checking" and the timer pauses. If a call fails, the game shows the problem
with a **retry** button, which is safe because the server never scores the same
answer twice. A failed Google sign-in shows its message in the top bar.

### Database (for ranked play)

The schema lives in `supabase/migrations/`, and the answer key in the
generated `supabase/answers.sql`. Using the Supabase dashboard:

1. Open **SQL Editor** and run each file in `supabase/migrations/` once, in
   order:
   - `20261026000100_schema.sql`: tables, row-level security, profile trigger
   - `20261026000200_ranked_runs.sql`: the ranked-run functions
   - `20261026000300_leaderboard.sql`: the public leaderboard
2. Paste `supabase/answers.sql` and run it. Run it again whenever a
   `meta.json` changes, after regenerating it with `npm run db:answers`.

What the schema enforces:

- Every signed-in user gets a `profiles` row (Google name and avatar),
  created by a trigger.
- Players can read only their own `runs` and `run_questions`. Nobody can
  read `snippet_answers` from the client. No table accepts writes from the
  client; ranked play will write only through server-side functions.
- One active run per player. Scores, lives and status are checked by
  constraints.
- Removing a snippet that past runs used makes `answers.sql` fail without
  changing anything, so run history is never orphaned.

Ranked play runs entirely in the database, through three functions that
signed-in players call over Supabase RPC:

| Function | What it does |
| --- | --- |
| `start_run(lang)` | Finishes any active run, shuffles the deck, returns question 1 (4 options, time limit) |
| `submit_answer(run, n, choice)` | Times the answer on the server (with 300 ms grace for the network), scores it, and returns the answer and explanation plus the next question or the final score. `null` means the timer ran out. Repeating an answered question returns the same result. |
| `end_run(run)` | Ends a run early, keeping its score |
| `leaderboard()` | Public. Top 10 players by their best finished run, ignoring flagged and zero-score runs. Shows full Google names, with equal scores sharing a rank. Returns no player ids; `is_me` marks your own row. |
| `my_best()` | Signed-in only. Your best counted run and your overall rank |

When Supabase is configured, the app adds a `$ leaderboard` section showing the
top 10, your row marked "· you", and your rank if you're outside the top 10.

The scoring rules in SQL mirror `src/game/engine.ts`; a test checks that both
give identical points for thousands of inputs. Runs with answers faster than a
person can read (under 400 ms, or under 1 s on average) are flagged. Runs idle
for 10 minutes are finished automatically, and each player can start up to 30
runs an hour. Errors use PostgREST `PTxyz` codes, so the API responds with
HTTP status `xyz` (for example `PT429 rate_limited`).

`tests/db.test.ts`, `tests/db-ranked.test.ts` and `tests/db-leaderboard.test.ts`
apply the migrations to an in-process Postgres ([PGlite](https://pglite.dev)) and
check all of the above.

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
  game/run.ts              the interface both run modes share with the game screens
  game/useLocalRun.ts      practice runs, backed by engine.ts
  game/ranked-state.ts     ranked-run state: a pure reducer over server responses
  game/useRankedRun.ts     ranked runs, backed by start_run / submit_answer / end_run
  lib/scores.ts            high scores in localStorage
  lib/supabase.ts          Supabase client (null when not configured)
  lib/leaderboard.ts       leaderboard() and my_best() calls
  lib/ranked.ts            ranked-run calls and player-facing error messages
  auth/AuthProvider.tsx    Google sign-in state for the session bar
  components/              Hero, Game, CodeView, Leaderboard, CheatSheet, Method, Faq, …
  styles.css               playful geometric theme (design tokens in :root)
scripts/check-snippets.mjs compiles every snippet in every language
scripts/gen-answers-sql.mjs builds supabase/answers.sql from snippet metadata
supabase/migrations/       database schema, RLS and triggers
supabase/answers.sql       generated answer key (do not edit by hand)
tests/                     Vitest suites (snippets, engine, database, leaderboard view)
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

## URLs and deploying

The site is one page, but each section has its own address: `/play`,
`/leaderboard`, `/cheat-sheet`, `/method` and `/faq` (`/` is the top). Opening
one directly scrolls to that section. Nav links change the address without a
reload, and back/forward move between sections. Old `#section` links are
rewritten to the path form, and unknown paths fall back to `/`. The hook lives
in `src/lib/useSectionRoutes.ts` and uses only the browser's History API, with
no router dependency.

Sign-in uses Supabase's PKCE flow, so no tokens appear in the address bar, and
you return to the section you signed in from.

`netlify.toml` holds the Netlify build settings (`npm run build`, publish
`dist`, Node 20) and a rule that serves `index.html` for every path, so
`/leaderboard` works on a fresh load. When deploying:

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify. Don't mark
   them secret: they're public, and they're built into the site's JavaScript.
2. Add `https://<your-site>.netlify.app/**` to Supabase → Authentication → URL
   Configuration → Redirect URLs, and make that address the Site URL.
3. Add `https://<your-site>.netlify.app` to the Google OAuth client's authorised
   JavaScript origins.

## Design

The UI follows a "playful geometric" style: warm paper background, white
book-shaped panels with a violet offset backing and a coloured number tab, and
violet, pink, amber and mint accents. Headings use Host Grotesk and body text
uses Instrument Sans, loaded under the `PlayfulGeometricDisplay` and
`PlayfulGeometricReading` aliases; code stays in IBM Plex Mono so characters
line up. Buttons are rounded and outlined, with a hard offset shadow; they lift
slightly on hover and sink when pressed. The opening shapes are decorative and
hidden from screen readers.

The design tokens live at the top of `src/styles.css`. The layout narrows at
1100 px and stacks at 760 px. It respects `prefers-reduced-motion` (no
transitions or lifts), keeps keyboard focus visible outside the shadows, and has
no horizontal scrolling down to 375 px wide.

## Credits

All snippets and explanations are original to this project. The fonts are
Host Grotesk, Instrument Sans and IBM Plex Mono, all licensed under the SIL
Open Font License.
