import { snip } from '../types';

export const CONSTANT = [
  snip(
    'ends',
    'first and last element',
    'O(1)',
    'Two index reads, whatever the length of the array.',
    `
def ends(items):
    if not items:
        return None
    return items[0], items[-1]
`,
    `
function ends(items) {
  if (items.length === 0) return null;
  return [items[0], items[items.length - 1]];
}
`,
    `
int[] ends(int[] items) {
    if (items.length == 0) return null;
    return new int[] { items[0], items[items.length - 1] };
}
`,
  ),
  snip(
    'warmup',
    'fixed-count loop',
    'O(1)',
    'The loop always runs 100 times. A bound that never depends on n is a constant, however large it is.',
    `
def warmup(n):
    total = 0
    for i in range(100):
        total += i * n
    return total
`,
    `
function warmup(n) {
  let total = 0;
  for (let i = 0; i < 100; i++) total += i * n;
  return total;
}
`,
    `
long warmup(long n) {
    long total = 0;
    for (int i = 0; i < 100; i++) total += i * n;
    return total;
}
`,
  ),
  snip(
    'swap-ends',
    'swap first and last',
    'O(1)',
    'A fixed number of reads and writes. No step walks the array.',
    `
def swap_ends(items):
    if len(items) > 1:
        items[0], items[-1] = items[-1], items[0]
    return items
`,
    `
function swapEnds(items) {
  if (items.length > 1) {
    const last = items.length - 1;
    [items[0], items[last]] = [items[last], items[0]];
  }
  return items;
}
`,
    `
void swapEnds(int[] items) {
    if (items.length > 1) {
        int last = items.length - 1;
        int t = items[0];
        items[0] = items[last];
        items[last] = t;
    }
}
`,
  ),
  snip(
    'gauss',
    'sum 1..n by formula',
    'O(1)',
    'A closed-form formula replaces the loop: one multiply and one divide for any n.',
    `
def sum_to(n):
    return n * (n + 1) // 2
`,
    `
function sumTo(n) {
  return (n * (n + 1)) / 2;
}
`,
    `
long sumTo(long n) {
    return n * (n + 1) / 2;
}
`,
  ),
  snip(
    'pow2',
    'power-of-two check',
    'O(1)',
    'A single bit trick: a power of two has exactly one set bit, so n & (n - 1) clears it to zero.',
    `
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
`,
    `
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
`,
    `
boolean isPowerOfTwo(long n) {
    return n > 0 && (n & (n - 1)) == 0;
}
`,
  ),
  snip(
    'stack-push',
    'push and peek',
    'O(1)',
    'Appending to the end of a dynamic array is amortised O(1): occasional resizes are paid for by the many cheap appends.',
    `
def push_and_peek(stack, value):
    stack.append(value)
    return stack[-1]
`,
    `
function pushAndPeek(stack, value) {
  stack.push(value);
  return stack[stack.length - 1];
}
`,
    `
int pushAndPeek(List<Integer> stack, int value) {
    stack.add(value);
    return stack.get(stack.size() - 1);
}
`,
  ),
  snip(
    'hash-get',
    'hash map lookup',
    'O(1)',
    'A hash lookup jumps straight to a bucket. It is O(1) on average; heavy collisions are the rare exception.',
    `
def price_of(prices, item):
    return prices.get(item, 0)
`,
    `
function priceOf(prices, item) {
  return prices.get(item) ?? 0;
}
`,
    `
int priceOf(Map<String, Integer> prices, String item) {
    return prices.getOrDefault(item, 0);
}
`,
  ),
  snip(
    'neighbours',
    'count live neighbours',
    'O(1)',
    'Exactly eight neighbours are checked for one cell, no matter how big the grid is.',
    `
DIRS = [(-1, -1), (-1, 0), (-1, 1), (0, -1),
        (0, 1), (1, -1), (1, 0), (1, 1)]

def live_neighbours(grid, r, c):
    count = 0
    for dr, dc in DIRS:
        rr, cc = r + dr, c + dc
        if 0 <= rr < len(grid) and 0 <= cc < len(grid[0]):
            count += grid[rr][cc]
    return count
`,
    `
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1],
              [0, 1], [1, -1], [1, 0], [1, 1]];

function liveNeighbours(grid, r, c) {
  let count = 0;
  for (const [dr, dc] of DIRS) {
    const rr = r + dr, cc = c + dc;
    if (rr >= 0 && rr < grid.length && cc >= 0 && cc < grid[0].length) {
      count += grid[rr][cc];
    }
  }
  return count;
}
`,
    `
static final int[][] DIRS = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
                             {0, 1}, {1, -1}, {1, 0}, {1, 1}};

int liveNeighbours(int[][] grid, int r, int c) {
    int count = 0;
    for (int[] d : DIRS) {
        int rr = r + d[0], cc = c + d[1];
        if (rr >= 0 && rr < grid.length && cc >= 0 && cc < grid[0].length) {
            count += grid[rr][cc];
        }
    }
    return count;
}
`,
  ),
  snip(
    'ring-get',
    'ring buffer read',
    'O(1)',
    'Modular arithmetic finds the slot directly. Nothing walks the buffer.',
    `
def ring_get(buffer, head, k):
    return buffer[(head + k) % len(buffer)]
`,
    `
function ringGet(buffer, head, k) {
  return buffer[(head + k) % buffer.length];
}
`,
    `
int ringGet(int[] buffer, int head, int k) {
    return buffer[(head + k) % buffer.length];
}
`,
  ),
];
