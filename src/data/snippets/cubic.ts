import { snip } from '../types';

export const CUBIC = [
  snip(
    'matmul',
    'schoolbook matrix multiply',
    'O(n³)',
    'Three nested loops, each running n times.',
    `
def matmul(A, B):
    n = len(A)
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C
`,
    `
function matmul(A, B) {
  const n = A.length;
  const C = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}
`,
    `
long[][] matmul(long[][] A, long[][] B) {
    int n = A.length;
    long[][] C = new long[n][n];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            for (int k = 0; k < n; k++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
`,
  ),
  snip(
    'zero-triplets',
    'count zero-sum triplets by brute force',
    'O(n³)',
    'Every triple i < j < k is checked: n(n − 1)(n − 2) / 6 combinations.',
    `
def zero_triplets(nums):
    n = len(nums)
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    count += 1
    return count
`,
    `
function zeroTriplets(nums) {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      for (let k = j + 1; k < n; k++)
        if (nums[i] + nums[j] + nums[k] === 0) count++;
  return count;
}
`,
    `
int zeroTriplets(int[] nums) {
    int n = nums.length, count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            for (int k = j + 1; k < n; k++)
                if (nums[i] + nums[j] + nums[k] == 0) count++;
    return count;
}
`,
  ),
  snip(
    'floyd-warshall',
    'all-pairs shortest paths',
    'O(n³)',
    'For each of the n intermediate vertices, every one of the n² pairs is relaxed.',
    `
def all_pairs_shortest(dist):
    n = len(dist)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist
`,
    `
function allPairsShortest(dist) {
  const n = dist.length;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}
`,
    `
void allPairsShortest(long[][] dist) {
    int n = dist.length;
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
}
`,
  ),
  snip(
    'subarray-recompute',
    'best subarray, summing each from scratch',
    'O(n³)',
    'There are O(n²) (i, j) ranges, and each one is re-summed in O(n).',
    `
def max_subarray_slow(nums):
    best = nums[0]
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            s = 0
            for k in range(i, j + 1):
                s += nums[k]
            best = max(best, s)
    return best
`,
    `
function maxSubarraySlow(nums) {
  let best = nums[0];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      let s = 0;
      for (let k = i; k <= j; k++) s += nums[k];
      best = Math.max(best, s);
    }
  }
  return best;
}
`,
    `
long maxSubarraySlow(int[] nums) {
    long best = nums[0];
    for (int i = 0; i < nums.length; i++) {
        for (int j = i; j < nums.length; j++) {
            long s = 0;
            for (int k = i; k <= j; k++) s += nums[k];
            best = Math.max(best, s);
        }
    }
    return best;
}
`,
  ),
  snip(
    'triangles',
    'count triangles in an adjacency matrix',
    'O(n³)',
    'In the worst case (a dense graph), every vertex triple i < j < k is examined.',
    `
def count_triangles(adj):
    n = len(adj)
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if adj[i][j]:
                for k in range(j + 1, n):
                    if adj[j][k] and adj[i][k]:
                        count += 1
    return count
`,
    `
function countTriangles(adj) {
  const n = adj.length;
  let count = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (adj[i][j])
        for (let k = j + 1; k < n; k++)
          if (adj[j][k] && adj[i][k]) count++;
  return count;
}
`,
    `
int countTriangles(boolean[][] adj) {
    int n = adj.length, count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (adj[i][j])
                for (int k = j + 1; k < n; k++)
                    if (adj[j][k] && adj[i][k]) count++;
    return count;
}
`,
  ),
  snip(
    'longest-palindrome-brute',
    'longest palindrome by checking every substring',
    'O(n³)',
    'There are O(n²) substrings, and each is copied and reversed in O(n).',
    `
def longest_palindrome(s):
    best = ""
    for i in range(len(s)):
        for j in range(i + 1, len(s) + 1):
            sub = s[i:j]
            if sub == sub[::-1] and len(sub) > len(best):
                best = sub
    return best
`,
    `
function longestPalindrome(s) {
  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      const sub = s.slice(i, j);
      if (sub === [...sub].reverse().join("") && sub.length > best.length) best = sub;
    }
  }
  return best;
}
`,
    `
String longestPalindrome(String s) {
    String best = "";
    for (int i = 0; i < s.length(); i++) {
        for (int j = i + 1; j <= s.length(); j++) {
            String sub = s.substring(i, j);
            boolean pal = new StringBuilder(sub).reverse().toString().equals(sub);
            if (pal && sub.length() > best.length()) best = sub;
        }
    }
    return best;
}
`,
  ),
  snip(
    'matrix-chain',
    'matrix-chain order (interval DP)',
    'O(n³)',
    'There are O(n²) intervals, and each tries up to n split points.',
    `
def chain_cost(dims):
    n = len(dims) - 1
    cost = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            cost[i][j] = min(
                cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                for k in range(i, j)
            )
    return cost[0][n - 1]
`,
    `
function chainCost(dims) {
  const n = dims.length - 1;
  const cost = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      cost[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const c = cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        cost[i][j] = Math.min(cost[i][j], c);
      }
    }
  }
  return cost[0][n - 1];
}
`,
    `
long chainCost(int[] dims) {
    int n = dims.length - 1;
    long[][] cost = new long[n][n];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            cost[i][j] = Long.MAX_VALUE;
            for (int k = i; k < j; k++) {
                long c = cost[i][k] + cost[k + 1][j] + (long) dims[i] * dims[k + 1] * dims[j + 1];
                cost[i][j] = Math.min(cost[i][j], c);
            }
        }
    }
    return cost[0][n - 1];
}
`,
  ),
];
