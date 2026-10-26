import { snip } from '../types';

export const QUADRATIC = [
  snip(
    'equal-pairs',
    'count equal ordered pairs',
    'O(n²)',
    'Two full nested loops over the same input: n × n.',
    `
def count_equal_pairs(xs):
    count = 0
    for i in range(len(xs)):
        for j in range(len(xs)):
            if i != j and xs[i] == xs[j]:
                count += 1
    return count
`,
    `
function countEqualPairs(xs) {
  let count = 0;
  for (let i = 0; i < xs.length; i++) {
    for (let j = 0; j < xs.length; j++) {
      if (i !== j && xs[i] === xs[j]) count++;
    }
  }
  return count;
}
`,
    `
int countEqualPairs(int[] xs) {
    int count = 0;
    for (int i = 0; i < xs.length; i++) {
        for (int j = 0; j < xs.length; j++) {
            if (i != j && xs[i] == xs[j]) count++;
        }
    }
    return count;
}
`,
  ),
  snip(
    'pair-sum-brute',
    'pair sum by brute force',
    'O(n²)',
    'The inner loop starts at i + 1, so the worst case is n(n − 1) / 2 checks. That is still quadratic.',
    `
def has_pair_sum(xs, target):
    for i in range(len(xs)):
        for j in range(i + 1, len(xs)):
            if xs[i] + xs[j] == target:
                return True
    return False
`,
    `
function hasPairSum(xs, target) {
  for (let i = 0; i < xs.length; i++) {
    for (let j = i + 1; j < xs.length; j++) {
      if (xs[i] + xs[j] === target) return true;
    }
  }
  return false;
}
`,
    `
boolean hasPairSum(int[] xs, int target) {
    for (int i = 0; i < xs.length; i++) {
        for (int j = i + 1; j < xs.length; j++) {
            if (xs[i] + xs[j] == target) return true;
        }
    }
    return false;
}
`,
  ),
  snip(
    'bubble',
    'bubble sort',
    'O(n²)',
    'Up to n passes, each comparing neighbours across the unsorted part.',
    `
def bubble(a):
    n = len(a)
    for i in range(n):
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a
`,
    `
function bubble(a) {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}
`,
    `
void bubble(int[] a) {
    int n = a.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
        }
    }
}
`,
  ),
  snip(
    'selection',
    'selection sort',
    'O(n²)',
    'Each position scans the rest of the array for its minimum: n + (n − 1) + … + 1.',
    `
def selection_sort(a):
    for i in range(len(a)):
        smallest = i
        for j in range(i + 1, len(a)):
            if a[j] < a[smallest]:
                smallest = j
        a[i], a[smallest] = a[smallest], a[i]
    return a
`,
    `
function selectionSort(a) {
  for (let i = 0; i < a.length; i++) {
    let smallest = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[smallest]) smallest = j;
    }
    [a[i], a[smallest]] = [a[smallest], a[i]];
  }
  return a;
}
`,
    `
void selectionSort(int[] a) {
    for (int i = 0; i < a.length; i++) {
        int smallest = i;
        for (int j = i + 1; j < a.length; j++) {
            if (a[j] < a[smallest]) smallest = j;
        }
        int t = a[i]; a[i] = a[smallest]; a[smallest] = t;
    }
}
`,
  ),
  snip(
    'insertion',
    'insertion sort',
    'O(n²)',
    'In the worst case (reverse-sorted input), step i shifts i items. It is O(n) on input that is already sorted, but Big O here means the worst case.',
    `
def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
`,
    `
function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}
`,
    `
void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = key;
    }
}
`,
  ),
  snip(
    'distance-matrix',
    'pairwise distance matrix',
    'O(n²)',
    'n points produce an n × n table, with O(1) work per cell.',
    `
def distance_matrix(points):
    n = len(points)
    d = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            dx = points[i][0] - points[j][0]
            dy = points[i][1] - points[j][1]
            d[i][j] = (dx * dx + dy * dy) ** 0.5
    return d
`,
    `
function distanceMatrix(points) {
  const n = points.length;
  const d = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      d[i][j] = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
    }
  }
  return d;
}
`,
    `
double[][] distanceMatrix(double[][] points) {
    int n = points.length;
    double[][] d = new double[n][n];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            d[i][j] = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
        }
    }
    return d;
}
`,
  ),
  snip(
    'grid-sum',
    'brightness of an n × n image',
    'O(n²)',
    'With n as the side length there are n² pixels. The work is linear in the pixel count, so always state what n means.',
    `
def brightness(image):
    # image is n × n pixels
    total = 0
    for row in image:
        for px in row:
            total += px
    return total
`,
    `
function brightness(image) {
  // image is n × n pixels
  let total = 0;
  for (const row of image) {
    for (const px of row) total += px;
  }
  return total;
}
`,
    `
long brightness(int[][] image) {
    // image is n × n pixels
    long total = 0;
    for (int[] row : image) {
        for (int px : row) total += px;
    }
    return total;
}
`,
  ),
  snip(
    'lcs',
    'longest common subsequence table',
    'O(n²)',
    'It fills an (n + 1) × (m + 1) table with O(1) work per cell. When both strings have length n, that is n².',
    `
def lcs_length(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]
`,
    `
function lcsLength(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
`,
    `
int lcsLength(String a, String b) {
    int[][] dp = new int[a.length() + 1][b.length() + 1];
    for (int i = 1; i <= a.length(); i++) {
        for (int j = 1; j <= b.length(); j++) {
            dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                ? dp[i - 1][j - 1] + 1
                : Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[a.length()][b.length()];
}
`,
  ),
  snip(
    'inversions',
    'count inversions by brute force',
    'O(n²)',
    'Every pair i < j is compared once: n(n − 1) / 2 comparisons.',
    `
def inversions(a):
    count = 0
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            if a[i] > a[j]:
                count += 1
    return count
`,
    `
function inversions(a) {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (a[i] > a[j]) count++;
    }
  }
  return count;
}
`,
    `
long inversions(int[] a) {
    long count = 0;
    for (int i = 0; i < a.length; i++) {
        for (int j = i + 1; j < a.length; j++) {
            if (a[i] > a[j]) count++;
        }
    }
    return count;
}
`,
  ),
  snip(
    'dedupe-list',
    'dedupe with a list membership test',
    'O(n²)',
    'The membership test on a list (in, includes, contains, std::find) is a hidden linear scan, and it runs inside a loop over n items.',
    `
def dedupe(items):
    out = []
    for x in items:
        if x not in out:
            out.append(x)
    return out
`,
    `
function dedupe(items) {
  const out = [];
  for (const x of items) {
    if (!out.includes(x)) out.push(x);
  }
  return out;
}
`,
    `
List<Integer> dedupe(List<Integer> items) {
    List<Integer> out = new ArrayList<>();
    for (int x : items) {
        if (!out.contains(x)) out.add(x);
    }
    return out;
}
`,
  ),
  snip(
    'palindromic-substrings',
    'count palindromic substrings',
    'O(n²)',
    'There are 2n − 1 centres, and each can expand up to about n / 2 steps.',
    `
def count_palindromes(s):
    count = 0
    for center in range(2 * len(s) - 1):
        lo = center // 2
        hi = lo + center % 2
        while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
            count += 1
            lo -= 1
            hi += 1
    return count
`,
    `
function countPalindromes(s) {
  let count = 0;
  for (let center = 0; center < 2 * s.length - 1; center++) {
    let lo = center >> 1;
    let hi = lo + (center % 2);
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      count++;
      lo--;
      hi++;
    }
  }
  return count;
}
`,
    `
int countPalindromes(String s) {
    int count = 0;
    for (int center = 0; center < 2 * s.length() - 1; center++) {
        int lo = center / 2;
        int hi = lo + center % 2;
        while (lo >= 0 && hi < s.length() && s.charAt(lo) == s.charAt(hi)) {
            count++;
            lo--;
            hi++;
        }
    }
    return count;
}
`,
  ),
  snip(
    'three-sum',
    'three numbers summing to zero',
    'O(n²)',
    'Sorting is O(n log n), then n two-pointer sweeps of O(n) each, which gives O(n²) overall.',
    `
def has_zero_triple(nums):
    s = sorted(nums)
    for i in range(len(s) - 2):
        lo, hi = i + 1, len(s) - 1
        while lo < hi:
            total = s[i] + s[lo] + s[hi]
            if total == 0:
                return True
            if total < 0:
                lo += 1
            else:
                hi -= 1
    return False
`,
    `
function hasZeroTriple(nums) {
  const s = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < s.length - 2; i++) {
    let lo = i + 1, hi = s.length - 1;
    while (lo < hi) {
      const total = s[i] + s[lo] + s[hi];
      if (total === 0) return true;
      if (total < 0) lo++;
      else hi--;
    }
  }
  return false;
}
`,
    `
boolean hasZeroTriple(int[] nums) {
    int[] s = nums.clone();
    Arrays.sort(s);
    for (int i = 0; i < s.length - 2; i++) {
        int lo = i + 1, hi = s.length - 1;
        while (lo < hi) {
            int total = s[i] + s[lo] + s[hi];
            if (total == 0) return true;
            if (total < 0) lo++;
            else hi--;
        }
    }
    return false;
}
`,
  ),
  snip(
    'staircase',
    'build a text staircase',
    'O(n²)',
    'Building a string of i + 1 characters costs O(i) work. Summed over n rows, that is about n² / 2.',
    `
def staircase(n):
    rows = []
    for i in range(n):
        rows.append("#" * (i + 1))
    return rows
`,
    `
function staircase(n) {
  const rows = [];
  for (let i = 0; i < n; i++) rows.push("#".repeat(i + 1));
  return rows;
}
`,
    `
List<String> staircase(int n) {
    List<String> rows = new ArrayList<>();
    for (int i = 0; i < n; i++) rows.add("#".repeat(i + 1));
    return rows;
}
`,
  ),
  snip(
    'drain-front',
    'drain a list from the front',
    'O(n²)',
    'Removing the first element of an array-backed list shifts all the remaining elements, and there are n removals. A deque avoids this.',
    `
def drain(queue):
    order = []
    while queue:
        order.append(queue.pop(0))
    return order
`,
    `
function drain(queue) {
  const order = [];
  while (queue.length > 0) order.push(queue.splice(0, 1)[0]);
  return order;
}
`,
    `
List<Integer> drain(ArrayList<Integer> queue) {
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) order.add(queue.remove(0));
    return order;
}
`,
  ),
];
