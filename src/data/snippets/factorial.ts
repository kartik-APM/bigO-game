import { snip } from '../types';

export const FACTORIAL = [
  snip(
    'permutations',
    'every permutation by slicing',
    'O(n!)',
    'There are n choices for the first slot, n − 1 for the next, and so on: n! orderings. Copying adds a factor of n, but the factorial dominates.',
    `
def permutations(items):
    if len(items) <= 1:
        return [items]
    out = []
    for i in range(len(items)):
        rest = items[:i] + items[i + 1:]
        for p in permutations(rest):
            out.append([items[i]] + p)
    return out
`,
    `
function permutations(items) {
  if (items.length <= 1) return [items];
  const out = [];
  items.forEach((first, i) => {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) out.push([first, ...p]);
  });
  return out;
}
`,
    `
List<List<Integer>> permutations(List<Integer> items) {
    if (items.size() <= 1) return List.of(items);
    List<List<Integer>> out = new ArrayList<>();
    for (int i = 0; i < items.size(); i++) {
        List<Integer> rest = new ArrayList<>(items);
        int first = rest.remove(i);
        for (List<Integer> p : permutations(rest)) {
            List<Integer> next = new ArrayList<>();
            next.add(first);
            next.addAll(p);
            out.add(next);
        }
    }
    return out;
}
`,
  ),
  snip(
    'tsp-brute',
    'shortest round trip by brute force',
    'O(n!)',
    'It tries all (n − 1)! orders of the other cities and prices each one in O(n).',
    `
from itertools import permutations

def shortest_tour(dist):
    n = len(dist)
    best = float("inf")
    for order in permutations(range(1, n)):
        route = (0,) + order + (0,)
        cost = sum(dist[route[i]][route[i + 1]] for i in range(n))
        best = min(best, cost)
    return best
`,
    `
// permutations(arr) returns every ordering of arr
function shortestTour(dist) {
  const n = dist.length;
  const others = [...Array(n - 1).keys()].map((i) => i + 1);
  let best = Infinity;
  for (const order of permutations(others)) {
    const route = [0, ...order, 0];
    let cost = 0;
    for (let i = 0; i < n; i++) cost += dist[route[i]][route[i + 1]];
    best = Math.min(best, cost);
  }
  return best;
}
`,
    `
// permutations(list) returns every ordering of list
int shortestTour(int[][] dist) {
    int n = dist.length;
    List<Integer> others = new ArrayList<>();
    for (int i = 1; i < n; i++) others.add(i);
    int best = Integer.MAX_VALUE;
    for (List<Integer> order : permutations(others)) {
        int cost = 0, at = 0;
        for (int next : order) {
            cost += dist[at][next];
            at = next;
        }
        best = Math.min(best, cost + dist[at][0]);
    }
    return best;
}
`,
  ),
  snip(
    'anagrams',
    'every rearrangement of a word',
    'O(n!)',
    'The used-flags backtracking builds one string per ordering of the n distinct letters.',
    `
def anagrams(word):
    out = []
    used = [False] * len(word)

    def build(prefix):
        if len(prefix) == len(word):
            out.append(prefix)
            return
        for i, ch in enumerate(word):
            if not used[i]:
                used[i] = True
                build(prefix + ch)
                used[i] = False

    build("")
    return out
`,
    `
function anagrams(word) {
  const out = [];
  const used = new Array(word.length).fill(false);
  const build = (prefix) => {
    if (prefix.length === word.length) {
      out.push(prefix);
      return;
    }
    for (let i = 0; i < word.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      build(prefix + word[i]);
      used[i] = false;
    }
  };
  build("");
  return out;
}
`,
    `
void anagrams(String word, String prefix, boolean[] used, List<String> out) {
    if (prefix.length() == word.length()) {
        out.add(prefix);
        return;
    }
    for (int i = 0; i < word.length(); i++) {
        if (used[i]) continue;
        used[i] = true;
        anagrams(word, prefix + word.charAt(i), used, out);
        used[i] = false;
    }
}
`,
  ),
  snip(
    'n-queens',
    'count N-queens placements',
    'O(n!)',
    'Row 0 has n column choices, row 1 at most n − 1, and so on. Pruning helps in practice, but the bound stays n!.',
    `
def count_queens(n):
    cols, d1, d2 = set(), set(), set()

    def place(row):
        if row == n:
            return 1
        total = 0
        for c in range(n):
            if c in cols or row + c in d1 or row - c in d2:
                continue
            cols.add(c); d1.add(row + c); d2.add(row - c)
            total += place(row + 1)
            cols.remove(c); d1.remove(row + c); d2.remove(row - c)
        return total

    return place(0)
`,
    `
function countQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const place = (row) => {
    if (row === n) return 1;
    let total = 0;
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(row + c) || d2.has(row - c)) continue;
      cols.add(c); d1.add(row + c); d2.add(row - c);
      total += place(row + 1);
      cols.delete(c); d1.delete(row + c); d2.delete(row - c);
    }
    return total;
  };
  return place(0);
}
`,
    `
int place(int row, int n, boolean[] cols, boolean[] d1, boolean[] d2) {
    if (row == n) return 1;
    int total = 0;
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[row + c] || d2[row - c + n]) continue;
        cols[c] = d1[row + c] = d2[row - c + n] = true;
        total += place(row + 1, n, cols, d1, d2);
        cols[c] = d1[row + c] = d2[row - c + n] = false;
    }
    return total;
}
`,
  ),
  snip(
    'heaps-algorithm',
    'permutations by single swaps',
    'O(n!)',
    'Heap’s algorithm emits each of the n! orderings exactly once, using one swap between consecutive orderings.',
    `
def heaps(a, k, out):
    if k == 1:
        out.append(a[:])
        return
    for i in range(k - 1):
        heaps(a, k - 1, out)
        j = i if k % 2 == 0 else 0
        a[j], a[k - 1] = a[k - 1], a[j]
    heaps(a, k - 1, out)
`,
    `
function heaps(a, k, out) {
  if (k === 1) {
    out.push([...a]);
    return;
  }
  for (let i = 0; i < k - 1; i++) {
    heaps(a, k - 1, out);
    const j = k % 2 === 0 ? i : 0;
    [a[j], a[k - 1]] = [a[k - 1], a[j]];
  }
  heaps(a, k - 1, out);
}
`,
    `
void heaps(int[] a, int k, List<int[]> out) {
    if (k == 1) {
        out.add(a.clone());
        return;
    }
    for (int i = 0; i < k - 1; i++) {
        heaps(a, k - 1, out);
        int j = k % 2 == 0 ? i : 0;
        int t = a[j]; a[j] = a[k - 1]; a[k - 1] = t;
    }
    heaps(a, k - 1, out);
}
`,
  ),
  snip(
    'factorial-tree',
    'n calls to f(n − 1)',
    'O(n!)',
    'T(n) = n × T(n − 1), which unrolls to n × (n − 1) × … × 1 = n!.',
    `
def f(n):
    if n == 0:
        return 1
    total = 0
    for _ in range(n):
        total += f(n - 1)
    return total
`,
    `
function f(n) {
  if (n === 0) return 1;
  let total = 0;
  for (let i = 0; i < n; i++) total += f(n - 1);
  return total;
}
`,
    `
long f(int n) {
    if (n == 0) return 1;
    long total = 0;
    for (int i = 0; i < n; i++) total += f(n - 1);
    return total;
}
`,
  ),
  snip(
    'next-perm-loop',
    'step through every ordering',
    'O(n!)',
    'The loop runs once for each distinct ordering, n! of them when the items are distinct. Each step is O(n) on top of that.',
    `
# next_permutation(a) moves a to the next ordering in O(n)
# and returns False after the last one
def count_orderings(a):
    a = sorted(a)
    count = 1
    while next_permutation(a):
        count += 1
    return count
`,
    `
// nextPermutation(a) moves a to the next ordering in O(n)
// and returns false after the last one
function countOrderings(a) {
  a = [...a].sort((x, y) => x - y);
  let count = 1;
  while (nextPermutation(a)) count++;
  return count;
}
`,
    `
// nextPermutation(a) moves a to the next ordering in O(n)
// and returns false after the last one
long countOrderings(int[] a) {
    a = a.clone();
    Arrays.sort(a);
    long count = 1;
    while (nextPermutation(a)) count++;
    return count;
}
`,
  ),
  snip(
    'derangements-brute',
    'count derangements by enumeration',
    'O(n!)',
    'The swap-based search walks the orderings with only a cheap filter at each position. Its worst case is still on the order of n! arrangements.',
    `
def derangements(n):
    a = list(range(n))

    def go(i):
        if i == n:
            return 1
        total = 0
        for j in range(i, n):
            a[i], a[j] = a[j], a[i]
            if a[i] != i:
                total += go(i + 1)
            a[i], a[j] = a[j], a[i]
        return total

    return go(0)
`,
    `
function derangements(n) {
  const a = [...Array(n).keys()];
  const go = (i) => {
    if (i === n) return 1;
    let total = 0;
    for (let j = i; j < n; j++) {
      [a[i], a[j]] = [a[j], a[i]];
      if (a[i] !== i) total += go(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return total;
  };
  return go(0);
}
`,
    `
long go(int[] a, int i) {
    if (i == a.length) return 1;
    long total = 0;
    for (int j = i; j < a.length; j++) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
        if (a[i] != i) total += go(a, i + 1);
        t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return total;
}
`,
  ),
];
