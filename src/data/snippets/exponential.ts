import { snip } from '../types';

export const EXPONENTIAL = [
  snip(
    'naive-fib',
    'Fibonacci without memoisation',
    'O(2ⁿ)',
    'Each call makes two more, the depth is n, and nothing is cached. The tight bound is about 1.618ⁿ, which falls in the exponential class.',
    `
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
`,
    `
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
`,
    `
long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}
`,
  ),
  snip(
    'count-subsets',
    'count subsets hitting a target',
    'O(2ⁿ)',
    'Every element is either taken or skipped: two branches per level, n levels deep.',
    `
def count_subsets(nums, target, i=0):
    if i == len(nums):
        return 1 if target == 0 else 0
    take = count_subsets(nums, target - nums[i], i + 1)
    skip = count_subsets(nums, target, i + 1)
    return take + skip
`,
    `
function countSubsets(nums, target, i = 0) {
  if (i === nums.length) return target === 0 ? 1 : 0;
  const take = countSubsets(nums, target - nums[i], i + 1);
  const skip = countSubsets(nums, target, i + 1);
  return take + skip;
}
`,
    `
int countSubsets(int[] nums, int target, int i) {
    if (i == nums.length) return target == 0 ? 1 : 0;
    int take = countSubsets(nums, target - nums[i], i + 1);
    int skip = countSubsets(nums, target, i + 1);
    return take + skip;
}
`,
  ),
  snip(
    'power-set',
    'build the power set',
    'O(2ⁿ)',
    'The output doubles with every item, giving 2ⁿ subsets. Counting the copying it is n × 2ⁿ, but of these choices the class is exponential.',
    `
def power_set(items):
    if not items:
        return [[]]
    rest = power_set(items[1:])
    return rest + [[items[0]] + s for s in rest]
`,
    `
function powerSet(items) {
  if (items.length === 0) return [[]];
  const rest = powerSet(items.slice(1));
  return rest.concat(rest.map((s) => [items[0], ...s]));
}
`,
    `
List<List<Integer>> powerSet(List<Integer> items) {
    if (items.isEmpty()) return List.of(List.of());
    List<List<Integer>> rest = powerSet(items.subList(1, items.size()));
    List<List<Integer>> out = new ArrayList<>(rest);
    for (List<Integer> s : rest) {
        List<Integer> with = new ArrayList<>();
        with.add(items.get(0));
        with.addAll(s);
        out.add(with);
    }
    return out;
}
`,
  ),
  snip(
    'hanoi',
    'Tower of Hanoi',
    'O(2ⁿ)',
    'There are two recursive calls on n − 1 disks: T(n) = 2T(n − 1) + 1, which is 2ⁿ − 1 moves.',
    `
def hanoi(n, src, dst, via, moves):
    if n == 0:
        return
    hanoi(n - 1, src, via, dst, moves)
    moves.append((src, dst))
    hanoi(n - 1, via, dst, src, moves)
`,
    `
function hanoi(n, src, dst, via, moves) {
  if (n === 0) return;
  hanoi(n - 1, src, via, dst, moves);
  moves.push([src, dst]);
  hanoi(n - 1, via, dst, src, moves);
}
`,
    `
void hanoi(int n, int src, int dst, int via, List<int[]> moves) {
    if (n == 0) return;
    hanoi(n - 1, src, via, dst, moves);
    moves.add(new int[] { src, dst });
    hanoi(n - 1, via, dst, src, moves);
}
`,
  ),
  snip(
    'binary-strings',
    'every binary string of length n',
    'O(2ⁿ)',
    'Each position branches into "0" and "1", producing 2ⁿ strings.',
    `
def binary_strings(n, prefix="", out=None):
    if out is None:
        out = []
    if len(prefix) == n:
        out.append(prefix)
    else:
        binary_strings(n, prefix + "0", out)
        binary_strings(n, prefix + "1", out)
    return out
`,
    `
function binaryStrings(n, prefix = "", out = []) {
  if (prefix.length === n) out.push(prefix);
  else {
    binaryStrings(n, prefix + "0", out);
    binaryStrings(n, prefix + "1", out);
  }
  return out;
}
`,
    `
void binaryStrings(int n, String prefix, List<String> out) {
    if (prefix.length() == n) {
        out.add(prefix);
        return;
    }
    binaryStrings(n, prefix + "0", out);
    binaryStrings(n, prefix + "1", out);
}
`,
  ),
  snip(
    'no-adjacent-masks',
    'bitmasks with no adjacent ones',
    'O(2ⁿ)',
    'The loop visits all 2ⁿ masks, and each check is O(1).',
    `
def no_adjacent_ones(n):
    count = 0
    for mask in range(1 << n):
        if (mask & (mask >> 1)) == 0:
            count += 1
    return count
`,
    `
function noAdjacentOnes(n) {
  let count = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    if ((mask & (mask >> 1)) === 0) count++;
  }
  return count;
}
`,
    `
int noAdjacentOnes(int n) {
    int count = 0;
    for (int mask = 0; mask < 1 << n; mask++) {
        if ((mask & (mask >> 1)) == 0) count++;
    }
    return count;
}
`,
  ),
  snip(
    'knapsack-naive',
    '0/1 knapsack without memoisation',
    'O(2ⁿ)',
    'Each item is taken or skipped, giving up to 2ⁿ paths. Memoising on (i, cap) would make it pseudo-polynomial.',
    `
def best_value(weights, values, cap, i=0):
    if i == len(weights):
        return 0
    skip = best_value(weights, values, cap, i + 1)
    if weights[i] > cap:
        return skip
    take = values[i] + best_value(weights, values, cap - weights[i], i + 1)
    return max(skip, take)
`,
    `
function bestValue(weights, values, cap, i = 0) {
  if (i === weights.length) return 0;
  const skip = bestValue(weights, values, cap, i + 1);
  if (weights[i] > cap) return skip;
  const take = values[i] + bestValue(weights, values, cap - weights[i], i + 1);
  return Math.max(skip, take);
}
`,
    `
int bestValue(int[] weights, int[] values, int cap, int i) {
    if (i == weights.length) return 0;
    int skip = bestValue(weights, values, cap, i + 1);
    if (weights[i] > cap) return skip;
    int take = values[i] + bestValue(weights, values, cap - weights[i], i + 1);
    return Math.max(skip, take);
}
`,
  ),
  snip(
    'gray-code',
    'n-bit Gray code',
    'O(2ⁿ)',
    'It produces one code for each of the 2ⁿ values, with O(1) work per code.',
    `
def gray_code(n):
    return [i ^ (i >> 1) for i in range(1 << n)]
`,
    `
function grayCode(n) {
  const out = [];
  for (let i = 0; i < 1 << n; i++) out.push(i ^ (i >> 1));
  return out;
}
`,
    `
List<Integer> grayCode(int n) {
    List<Integer> out = new ArrayList<>();
    for (int i = 0; i < 1 << n; i++) out.add(i ^ (i >> 1));
    return out;
}
`,
  ),
  snip(
    'best-under-limit',
    'best subset sum under a limit (bitmask)',
    'O(2ⁿ)',
    'There are 2ⁿ masks, each summed over n bits: n × 2ⁿ. That is still the exponential class.',
    `
def best_under(nums, limit):
    n = len(nums)
    best = 0
    for mask in range(1 << n):
        s = 0
        for i in range(n):
            if (mask >> i) & 1:
                s += nums[i]
        if s <= limit:
            best = max(best, s)
    return best
`,
    `
function bestUnder(nums, limit) {
  const n = nums.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if ((mask >> i) & 1) s += nums[i];
    if (s <= limit) best = Math.max(best, s);
  }
  return best;
}
`,
    `
int bestUnder(int[] nums, int limit) {
    int n = nums.length, best = 0;
    for (int mask = 0; mask < 1 << n; mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) if (((mask >> i) & 1) == 1) s += nums[i];
        if (s <= limit) best = Math.max(best, s);
    }
    return best;
}
`,
  ),
];
