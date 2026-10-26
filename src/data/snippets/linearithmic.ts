import { snip } from '../types';

export const LINEARITHMIC = [
  snip(
    'has-duplicate',
    'sort, then scan for duplicates',
    'O(n log n)',
    'Sorting costs O(n log n). The scan afterwards is only O(n), so the sort dominates.',
    `
def has_duplicate(nums):
    s = sorted(nums)
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            return True
    return False
`,
    `
function hasDuplicate(nums) {
  const s = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) return true;
  }
  return false;
}
`,
    `
boolean hasDuplicate(int[] nums) {
    int[] s = nums.clone();
    Arrays.sort(s);
    for (int i = 1; i < s.length; i++) {
        if (s[i] == s[i - 1]) return true;
    }
    return false;
}
`,
  ),
  snip(
    'linear-times-doubling',
    'doubling loop inside a linear loop',
    'O(n log n)',
    'There are n outer iterations, and each runs an inner loop that doubles j up to n: n × log n.',
    `
def count_steps(n):
    count = 0
    for i in range(n):
        j = 1
        while j < n:
            count += 1
            j *= 2
    return count
`,
    `
function countSteps(n) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j *= 2) count++;
  }
  return count;
}
`,
    `
long countSteps(int n) {
    long count = 0;
    for (int i = 0; i < n; i++) {
        for (long j = 1; j < n; j *= 2) count++;
    }
    return count;
}
`,
  ),
  snip(
    'merge-sort',
    'merge sort',
    'O(n log n)',
    'The input is split log n times, and each level of splitting does O(n) merging work.',
    `
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i])
            i += 1
        else:
            out.append(right[j])
            j += 1
    return out + left[i:] + right[j:]
`,
    `
function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}
`,
    `
int[] mergeSort(int[] a) {
    if (a.length <= 1) return a;
    int mid = a.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    int[] out = new int[a.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length)
        out[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) out[k++] = left[i++];
    while (j < right.length) out[k++] = right[j++];
    return out;
}
`,
  ),
  snip(
    'heap-sort',
    'sort through a priority queue',
    'O(n log n)',
    'There are n pushes and n pops, and each heap operation costs O(log n).',
    `
import heapq

def heap_sorted(nums):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
    return [heapq.heappop(heap) for _ in range(len(heap))]
`,
    `
// MinHeap is a binary heap: push and pop are O(log n)
function heapSorted(nums) {
  const heap = new MinHeap();
  for (const x of nums) heap.push(x);
  const out = [];
  while (heap.size > 0) out.push(heap.pop());
  return out;
}
`,
    `
List<Integer> heapSorted(int[] nums) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int x : nums) heap.add(x);
    List<Integer> out = new ArrayList<>();
    while (!heap.isEmpty()) out.add(heap.poll());
    return out;
}
`,
  ),
  snip(
    'search-each',
    'binary search for every item',
    'O(n log n)',
    'There are n lookups, and each is a binary search costing log n.',
    `
import bisect

def common_count(a, sorted_b):
    count = 0
    for x in a:
        i = bisect.bisect_left(sorted_b, x)
        if i < len(sorted_b) and sorted_b[i] == x:
            count += 1
    return count
`,
    `
function commonCount(a, sortedB) {
  let count = 0;
  for (const x of a) {
    let lo = 0, hi = sortedB.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sortedB[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (sortedB[lo] === x) count++;
  }
  return count;
}
`,
    `
int commonCount(int[] a, int[] sortedB) {
    int count = 0;
    for (int x : a) {
        if (Arrays.binarySearch(sortedB, x) >= 0) count++;
    }
    return count;
}
`,
  ),
  snip(
    'merge-intervals',
    'merge overlapping intervals',
    'O(n log n)',
    'Sorting by start time is O(n log n). The merge sweep after it is linear.',
    `
def merge_intervals(intervals):
    out = []
    for start, end in sorted(intervals):
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out
`,
    `
function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}
`,
    `
List<int[]> mergeIntervals(int[][] intervals) {
    int[][] sorted = intervals.clone();
    Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] iv : sorted) {
        int[] last = out.isEmpty() ? null : out.get(out.size() - 1);
        if (last != null && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
        else out.add(new int[] { iv[0], iv[1] });
    }
    return out;
}
`,
  ),
  snip(
    'harmonic',
    'divisor counts by multiples',
    'O(n log n)',
    'The inner loop runs n / d times. n/1 + n/2 + … + n/n = n × H(n), which is about n ln n.',
    `
def divisor_counts(n):
    counts = [0] * (n + 1)
    for d in range(1, n + 1):
        for multiple in range(d, n + 1, d):
            counts[multiple] += 1
    return counts
`,
    `
function divisorCounts(n) {
  const counts = new Array(n + 1).fill(0);
  for (let d = 1; d <= n; d++) {
    for (let m = d; m <= n; m += d) counts[m]++;
  }
  return counts;
}
`,
    `
int[] divisorCounts(int n) {
    int[] counts = new int[n + 1];
    for (int d = 1; d <= n; d++) {
        for (int m = d; m <= n; m += d) counts[m]++;
    }
    return counts;
}
`,
  ),
  snip(
    'meeting-rooms',
    'rooms needed for meetings',
    'O(n log n)',
    'Two sorts cost O(n log n). The sweep moves each pointer forward at most n times.',
    `
def rooms_needed(meetings):
    starts = sorted(s for s, _ in meetings)
    ends = sorted(e for _, e in meetings)
    rooms = best = 0
    j = 0
    for s in starts:
        while j < len(ends) and ends[j] <= s:
            rooms -= 1
            j += 1
        rooms += 1
        best = max(best, rooms)
    return best
`,
    `
function roomsNeeded(meetings) {
  const starts = meetings.map((m) => m[0]).sort((a, b) => a - b);
  const ends = meetings.map((m) => m[1]).sort((a, b) => a - b);
  let rooms = 0, best = 0, j = 0;
  for (const s of starts) {
    while (j < ends.length && ends[j] <= s) {
      rooms--;
      j++;
    }
    rooms++;
    best = Math.max(best, rooms);
  }
  return best;
}
`,
    `
int roomsNeeded(int[][] meetings) {
    int n = meetings.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) {
        starts[i] = meetings[i][0];
        ends[i] = meetings[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);
    int rooms = 0, best = 0, j = 0;
    for (int s : starts) {
        while (j < n && ends[j] <= s) {
            rooms--;
            j++;
        }
        rooms++;
        best = Math.max(best, rooms);
    }
    return best;
}
`,
  ),
  snip(
    'lis-tails',
    'longest increasing subsequence (tails)',
    'O(n log n)',
    'Each of the n values does one binary search into the tails array.',
    `
import bisect

def lis_length(nums):
    tails = []
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
`,
    `
function lisLength(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
`,
    `
int lisLength(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;
        if (lo == size) size++;
    }
    return size;
}
`,
  ),
  snip(
    'digit-total',
    'total digits of 1..n',
    'O(n log n)',
    'The number i has about log₁₀ i digits. Summed over 1..n, that is about n log n.',
    `
def total_digits(n):
    total = 0
    for i in range(1, n + 1):
        x = i
        while x > 0:
            x //= 10
            total += 1
    return total
`,
    `
function totalDigits(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    for (let x = i; x > 0; x = Math.floor(x / 10)) total++;
  }
  return total;
}
`,
    `
long totalDigits(int n) {
    long total = 0;
    for (int i = 1; i <= n; i++) {
        for (int x = i; x > 0; x /= 10) total++;
    }
    return total;
}
`,
  ),
  snip(
    'pairs-below',
    'count pairs below a limit',
    'O(n log n)',
    'The sort is O(n log n). The two-pointer sweep after it is O(n).',
    `
def pairs_below(nums, limit):
    s = sorted(nums)
    i, j = 0, len(s) - 1
    count = 0
    while i < j:
        if s[i] + s[j] < limit:
            count += j - i
            i += 1
        else:
            j -= 1
    return count
`,
    `
function pairsBelow(nums, limit) {
  const s = [...nums].sort((a, b) => a - b);
  let i = 0, j = s.length - 1, count = 0;
  while (i < j) {
    if (s[i] + s[j] < limit) {
      count += j - i;
      i++;
    } else {
      j--;
    }
  }
  return count;
}
`,
    `
long pairsBelow(int[] nums, int limit) {
    int[] s = nums.clone();
    Arrays.sort(s);
    int i = 0, j = s.length - 1;
    long count = 0;
    while (i < j) {
        if (s[i] + s[j] < limit) {
            count += j - i;
            i++;
        } else {
            j--;
        }
    }
    return count;
}
`,
  ),
  snip(
    'by-frequency',
    'order words by frequency',
    'O(n log n)',
    'Counting is O(n). Sorting up to n distinct words is O(n log n), and that dominates.',
    `
def by_frequency(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return sorted(counts, key=lambda w: -counts[w])
`,
    `
function byFrequency(words) {
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
}
`,
    `
List<String> byFrequency(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    for (String w : words) counts.merge(w, 1, Integer::sum);
    List<String> keys = new ArrayList<>(counts.keySet());
    keys.sort((a, b) -> counts.get(b) - counts.get(a));
    return keys;
}
`,
  ),
  snip(
    'doubling-passes',
    'full pass per doubling width',
    'O(n log n)',
    'The outer loop doubles width until it reaches n, about log n times, and each round is a full O(n) pass.',
    `
def weighted_passes(a):
    width = 1
    work = 0
    while width < len(a):
        for i in range(len(a)):
            work += a[i] * width
        width *= 2
    return work
`,
    `
function weightedPasses(a) {
  let work = 0;
  for (let width = 1; width < a.length; width *= 2) {
    for (let i = 0; i < a.length; i++) work += a[i] * width;
  }
  return work;
}
`,
    `
long weightedPasses(int[] a) {
    long work = 0;
    for (long width = 1; width < a.length; width *= 2) {
        for (int i = 0; i < a.length; i++) work += a[i] * width;
    }
    return work;
}
`,
  ),
];
