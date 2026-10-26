import { snip } from '../types';

export const ROOT = [
  snip(
    'is-prime',
    'trial-division prime check',
    'O(√n)',
    'Divisors are only tried while d × d ≤ n, because any factor above √n pairs with one below it.',
    `
def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True
`,
    `
function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false;
  }
  return true;
}
`,
    `
boolean isPrime(long n) {
    if (n < 2) return false;
    for (long d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}
`,
  ),
  snip(
    'isqrt-climb',
    'integer square root by counting',
    'O(√n)',
    'r goes up by one until r² passes n, which takes about √n steps.',
    `
def int_sqrt(n):
    r = 0
    while (r + 1) * (r + 1) <= n:
        r += 1
    return r
`,
    `
function intSqrt(n) {
  let r = 0;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
}
`,
    `
long intSqrt(long n) {
    long r = 0;
    while ((r + 1) * (r + 1) <= n) r++;
    return r;
}
`,
  ),
  snip(
    'count-divisors',
    'count divisors',
    'O(√n)',
    'Each divisor d found below √n also gives the partner n / d, so the loop stops at √n.',
    `
def count_divisors(n):
    count = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            count += 1 if d * d == n else 2
        d += 1
    return count
`,
    `
function countDivisors(n) {
  let count = 0;
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) count += d * d === n ? 1 : 2;
  }
  return count;
}
`,
    `
int countDivisors(long n) {
    int count = 0;
    for (long d = 1; d * d <= n; d++) {
        if (n % d == 0) count += d * d == n ? 1 : 2;
    }
    return count;
}
`,
  ),
  snip(
    'jump-search',
    'jump search',
    'O(√n)',
    'There are at most √n jumps of size √n, then at most √n single steps inside one block.',
    `
import math

def jump_search(sorted_items, target):
    n = len(sorted_items)
    step = max(1, math.isqrt(n))
    prev = 0
    while prev < n and sorted_items[min(prev + step, n) - 1] < target:
        prev += step
    for i in range(prev, min(prev + step, n)):
        if sorted_items[i] == target:
            return i
    return -1
`,
    `
function jumpSearch(sorted, target) {
  const n = sorted.length;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0;
  while (prev < n && sorted[Math.min(prev + step, n) - 1] < target) prev += step;
  for (let i = prev; i < Math.min(prev + step, n); i++) {
    if (sorted[i] === target) return i;
  }
  return -1;
}
`,
    `
int jumpSearch(int[] sorted, int target) {
    int n = sorted.length;
    int step = Math.max(1, (int) Math.sqrt(n));
    int prev = 0;
    while (prev < n && sorted[Math.min(prev + step, n) - 1] < target) prev += step;
    for (int i = prev; i < Math.min(prev + step, n); i++) {
        if (sorted[i] == target) return i;
    }
    return -1;
}
`,
  ),
  snip(
    'squares-up-to',
    'perfect squares up to n',
    'O(√n)',
    'i stops once i² passes n, after about √n iterations.',
    `
def squares_up_to(n):
    out = []
    i = 1
    while i * i <= n:
        out.append(i * i)
        i += 1
    return out
`,
    `
function squaresUpTo(n) {
  const out = [];
  for (let i = 1; i * i <= n; i++) out.push(i * i);
  return out;
}
`,
    `
List<Long> squaresUpTo(long n) {
    List<Long> out = new ArrayList<>();
    for (long i = 1; i * i <= n; i++) out.add(i * i);
    return out;
}
`,
  ),
  snip(
    'triangular-below',
    'triangular numbers up to n',
    'O(√n)',
    'The k-th triangular number is about k² / 2, so the loop ends after about √(2n) steps.',
    `
def triangular_up_to(n):
    out = []
    k, t = 1, 1
    while t <= n:
        out.append(t)
        k += 1
        t += k
    return out
`,
    `
function triangularUpTo(n) {
  const out = [];
  for (let k = 1, t = 1; t <= n; k++, t += k) out.push(t);
  return out;
}
`,
    `
List<Long> triangularUpTo(long n) {
    List<Long> out = new ArrayList<>();
    for (long k = 1, t = 1; t <= n; k++, t += k) out.add(t);
    return out;
}
`,
  ),
  snip(
    'factor-pairs',
    'list factor pairs',
    'O(√n)',
    'Each pair (d, n / d) is found from its smaller member, and the smaller member is never above √n.',
    `
def factor_pairs(n):
    pairs = []
    d = 1
    while d * d <= n:
        if n % d == 0:
            pairs.append((d, n // d))
        d += 1
    return pairs
`,
    `
function factorPairs(n) {
  const pairs = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) pairs.push([d, n / d]);
  }
  return pairs;
}
`,
    `
List<long[]> factorPairs(long n) {
    List<long[]> pairs = new ArrayList<>();
    for (long d = 1; d * d <= n; d++) {
        if (n % d == 0) pairs.add(new long[] { d, n / d });
    }
    return pairs;
}
`,
  ),
];
