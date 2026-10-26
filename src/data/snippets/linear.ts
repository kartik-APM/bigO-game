import { snip } from '../types';

export const LINEAR = [
  snip(
    'sum',
    'sum a list',
    'O(n)',
    'One pass, constant work per element.',
    `
def total(nums):
    s = 0
    for x in nums:
        s += x
    return s
`,
    `
function total(nums) {
  let s = 0;
  for (const x of nums) s += x;
  return s;
}
`,
    `
long total(int[] nums) {
    long s = 0;
    for (int x : nums) s += x;
    return s;
}
`,
  ),
  snip(
    'count-max',
    'count copies of the maximum',
    'O(n)',
    'Two loops one after the other: n + n = 2n, and the constant drops out.',
    `
def count_max(nums):
    best = nums[0]
    for x in nums:
        best = max(best, x)
    count = 0
    for x in nums:
        if x == best:
            count += 1
    return count
`,
    `
function countMax(nums) {
  let best = nums[0];
  for (const x of nums) best = Math.max(best, x);
  let count = 0;
  for (const x of nums) if (x === best) count++;
  return count;
}
`,
    `
int countMax(int[] nums) {
    int best = nums[0];
    for (int x : nums) best = Math.max(best, x);
    int count = 0;
    for (int x : nums) if (x == best) count++;
    return count;
}
`,
  ),
  snip(
    'unique-runs',
    'count runs in a sorted list',
    'O(n)',
    'The inner loop looks nested, but i jumps straight to j, so each index is visited once overall.',
    `
def unique_runs(sorted_nums):
    runs = 0
    i = 0
    while i < len(sorted_nums):
        j = i
        while j < len(sorted_nums) and sorted_nums[j] == sorted_nums[i]:
            j += 1
        runs += 1
        i = j
    return runs
`,
    `
function uniqueRuns(sorted) {
  let runs = 0;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j] === sorted[i]) j++;
    runs++;
    i = j;
  }
  return runs;
}
`,
    `
int uniqueRuns(int[] sorted) {
    int runs = 0;
    int i = 0;
    while (i < sorted.length) {
        int j = i;
        while (j < sorted.length && sorted[j] == sorted[i]) j++;
        runs++;
        i = j;
    }
    return runs;
}
`,
  ),
  snip(
    'memo-fib',
    'memoised Fibonacci',
    'O(n)',
    'Each value from 0 to n is computed once and cached. Repeat calls are O(1) lookups.',
    `
from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
`,
    `
const memo = new Map();

function fib(n) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = fib(n - 1) + fib(n - 2);
  memo.set(n, v);
  return v;
}
`,
    `
Map<Integer, Long> memo = new HashMap<>();

long fib(int n) {
    if (n < 2) return n;
    Long hit = memo.get(n);
    if (hit != null) return hit;
    long v = fib(n - 1) + fib(n - 2);
    memo.put(n, v);
    return v;
}
`,
  ),
  snip(
    'smooth',
    'five-point smoothing',
    'O(n)',
    'The inner loop always runs five times. n × 5 is still O(n).',
    `
def smooth(nums):
    out = []
    for i in range(len(nums)):
        s = 0
        for k in range(-2, 3):
            if 0 <= i + k < len(nums):
                s += nums[i + k]
        out.append(s)
    return out
`,
    `
function smooth(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    let s = 0;
    for (let k = -2; k <= 2; k++) {
      if (i + k >= 0 && i + k < nums.length) s += nums[i + k];
    }
    out.push(s);
  }
  return out;
}
`,
    `
int[] smooth(int[] nums) {
    int[] out = new int[nums.length];
    for (int i = 0; i < nums.length; i++) {
        for (int k = -2; k <= 2; k++) {
            if (i + k >= 0 && i + k < nums.length) out[i] += nums[i + k];
        }
    }
    return out;
}
`,
  ),
  snip(
    'reverse',
    'reverse in place',
    'O(n)',
    'Two pointers meet in the middle after n / 2 swaps.',
    `
def reverse(items):
    i, j = 0, len(items) - 1
    while i < j:
        items[i], items[j] = items[j], items[i]
        i += 1
        j -= 1
    return items
`,
    `
function reverse(items) {
  for (let i = 0, j = items.length - 1; i < j; i++, j--) {
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
`,
    `
void reverse(int[] items) {
    for (int i = 0, j = items.length - 1; i < j; i++, j--) {
        int t = items[i];
        items[i] = items[j];
        items[j] = t;
    }
}
`,
  ),
  snip(
    'palindrome',
    'palindrome check',
    'O(n)',
    'The two ends move inward, so at most n / 2 comparisons are made.',
    `
def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True
`,
    `
function isPalindrome(s) {
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}
`,
    `
boolean isPalindrome(String s) {
    for (int i = 0, j = s.length() - 1; i < j; i++, j--) {
        if (s.charAt(i) != s.charAt(j)) return false;
    }
    return true;
}
`,
  ),
  snip(
    'kadane',
    'maximum subarray (running best)',
    'O(n)',
    'A single pass keeps the best sum ending here and the best sum seen so far.',
    `
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
`,
    `
function maxSubarray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
`,
    `
int maxSubarray(int[] nums) {
    int best = nums[0], cur = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}
`,
  ),
  snip(
    'pair-sum-set',
    'pair sum with a set',
    'O(n)',
    'Set lookups are O(1) on average, so one pass is enough. Compare this with the nested-loop version.',
    `
def has_pair_sum(nums, target):
    seen = set()
    for x in nums:
        if target - x in seen:
            return True
        seen.add(x)
    return False
`,
    `
function hasPairSum(nums, target) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(target - x)) return true;
    seen.add(x);
  }
  return false;
}
`,
    `
boolean hasPairSum(int[] nums, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (seen.contains(target - x)) return true;
        seen.add(x);
    }
    return false;
}
`,
  ),
  snip(
    'frequencies',
    'word frequencies',
    'O(n)',
    'Each word costs one average-O(1) hash update.',
    `
def frequencies(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts
`,
    `
function frequencies(words) {
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return counts;
}
`,
    `
Map<String, Integer> frequencies(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    for (String w : words) counts.merge(w, 1, Integer::sum);
    return counts;
}
`,
  ),
  snip(
    'prefix-sums',
    'prefix sums',
    'O(n)',
    'Each entry is built from the one before it in O(1).',
    `
def prefix_sums(nums):
    out = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        out[i + 1] = out[i] + x
    return out
`,
    `
function prefixSums(nums) {
  const out = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) out[i + 1] = out[i] + nums[i];
  return out;
}
`,
    `
long[] prefixSums(int[] nums) {
    long[] out = new long[nums.length + 1];
    for (int i = 0; i < nums.length; i++) out[i + 1] = out[i] + nums[i];
    return out;
}
`,
  ),
  snip(
    'window-sum',
    'best sliding-window sum',
    'O(n)',
    'The first window costs k ≤ n. After that, each slide adds one value and drops one.',
    `
def max_window_sum(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)
    return best
`,
    `
function maxWindowSum(nums, k) {
  let window = 0;
  for (let i = 0; i < k; i++) window += nums[i];
  let best = window;
  for (let i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k];
    best = Math.max(best, window);
  }
  return best;
}
`,
    `
long maxWindowSum(int[] nums, int k) {
    long window = 0;
    for (int i = 0; i < k; i++) window += nums[i];
    long best = window;
    for (int i = k; i < nums.length; i++) {
        window += nums[i] - nums[i - k];
        best = Math.max(best, window);
    }
    return best;
}
`,
  ),
  snip(
    'linear-search',
    'linear search',
    'O(n)',
    'In the worst case the target is last or missing, so every element is checked.',
    `
def index_of(items, target):
    for i, x in enumerate(items):
        if x == target:
            return i
    return -1
`,
    `
function indexOf(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return i;
  }
  return -1;
}
`,
    `
int indexOf(int[] items, int target) {
    for (int i = 0; i < items.length; i++) {
        if (items[i] == target) return i;
    }
    return -1;
}
`,
  ),
  snip(
    'recursive-sum',
    'recursive sum by index',
    'O(n)',
    'One call per element, each doing O(1) work: a recursion chain of depth n.',
    `
def rec_sum(nums, i=0):
    if i == len(nums):
        return 0
    return nums[i] + rec_sum(nums, i + 1)
`,
    `
function recSum(nums, i = 0) {
  if (i === nums.length) return 0;
  return nums[i] + recSum(nums, i + 1);
}
`,
    `
long recSum(int[] nums, int i) {
    if (i == nums.length) return 0;
    return nums[i] + recSum(nums, i + 1);
}
`,
  ),
  snip(
    'factorial-value',
    'compute n factorial',
    'O(n)',
    'The result is n!, but computing it takes only n − 1 multiplications (treating each multiply as O(1)).',
    `
def factorial(n):
    result = 1
    for k in range(2, n + 1):
        result *= k
    return result
`,
    `
function factorial(n) {
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}
`,
    `
long factorial(int n) {
    long result = 1;
    for (int k = 2; k <= n; k++) result *= k;
    return result;
}
`,
  ),
  snip(
    'merge-sorted',
    'merge two sorted lists',
    'O(n)',
    'Every element is copied exactly once. That is O(n + m), which is linear in the total input.',
    `
def merge(a, b):
    out, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out
`,
    `
function merge(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  return out.concat(a.slice(i), b.slice(j));
}
`,
    `
int[] merge(int[] a, int[] b) {
    int[] out = new int[a.length + b.length];
    int i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length) out[k++] = a[i] <= b[j] ? a[i++] : b[j++];
    while (i < a.length) out[k++] = a[i++];
    while (j < b.length) out[k++] = b[j++];
    return out;
}
`,
  ),
  snip(
    'brackets',
    'balanced brackets',
    'O(n)',
    'Each character is pushed or popped at most once.',
    `
def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
`,
    `
function balanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (ch in pairs) {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
`,
    `
boolean balanced(String s) {
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '[' || ch == '{') stack.push(ch);
        else if (pairs.containsKey(ch)) {
            if (stack.isEmpty() || !stack.pop().equals(pairs.get(ch))) return false;
        }
    }
    return stack.isEmpty();
}
`,
  ),
  snip(
    'move-zeros',
    'move zeros to the end',
    'O(n)',
    'One pass compacts the non-zero values, and a second pass fills the tail with zeros.',
    `
def move_zeros(nums):
    write = 0
    for x in nums:
        if x != 0:
            nums[write] = x
            write += 1
    for i in range(write, len(nums)):
        nums[i] = 0
    return nums
`,
    `
function moveZeros(nums) {
  let write = 0;
  for (const x of nums) if (x !== 0) nums[write++] = x;
  for (let i = write; i < nums.length; i++) nums[i] = 0;
  return nums;
}
`,
    `
void moveZeros(int[] nums) {
    int write = 0;
    for (int x : nums) if (x != 0) nums[write++] = x;
    for (int i = write; i < nums.length; i++) nums[i] = 0;
}
`,
  ),
  snip(
    'next-greater',
    'next greater element (stack)',
    'O(n)',
    'The inner while pops, but each index is pushed once and popped at most once: about 2n operations in total.',
    `
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            result[stack.pop()] = x
        stack.append(i)
    return result
`,
    `
function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  nums.forEach((x, i) => {
    while (stack.length && nums[stack[stack.length - 1]] < x) {
      result[stack.pop()] = x;
    }
    stack.push(i);
  });
  return result;
}
`,
    `
int[] nextGreater(int[] nums) {
    int[] result = new int[nums.length];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            result[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return result;
}
`,
  ),
  snip(
    'dutch-flag',
    'three-way partition of 0s, 1s, 2s',
    'O(n)',
    'Each step either moves mid forward or moves hi back, so the gap closes within n steps.',
    `
def sort_colors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1
    return nums
`,
    `
function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    }
  }
  return nums;
}
`,
    `
void sortColors(int[] nums) {
    int lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            int t = nums[lo]; nums[lo] = nums[mid]; nums[mid] = t;
            lo++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int t = nums[mid]; nums[mid] = nums[hi]; nums[hi] = t;
            hi--;
        }
    }
}
`,
  ),
];
