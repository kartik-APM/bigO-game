import { snip } from '../types';

export const LOGARITHMIC = [
  snip(
    'binary-search',
    'binary search',
    'O(log n)',
    'Each comparison discards half of the remaining range.',
    `
def find(sorted_items, target):
    lo, hi = 0, len(sorted_items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_items[mid] == target:
            return mid
        if sorted_items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
    `
function find(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`,
    `
int find(int[] sorted, int target) {
    int lo = 0, hi = sorted.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) >>> 1;
        if (sorted[mid] == target) return mid;
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
`,
  ),
  snip(
    'halvings',
    'halve until one',
    'O(log n)',
    'n is cut in half on every pass, so the loop runs about log₂ n times.',
    `
def halvings(n):
    steps = 0
    while n > 1:
        n //= 2
        steps += 1
    return steps
`,
    `
function halvings(n) {
  let steps = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }
  return steps;
}
`,
    `
int halvings(long n) {
    int steps = 0;
    while (n > 1) {
        n /= 2;
        steps++;
    }
    return steps;
}
`,
  ),
  snip(
    'powers-below',
    'powers of two below n',
    'O(log n)',
    'p doubles on every iteration, so it passes n after about log₂ n steps.',
    `
def powers_below(n):
    out = []
    p = 1
    while p < n:
        out.append(p)
        p *= 2
    return out
`,
    `
function powersBelow(n) {
  const out = [];
  for (let p = 1; p < n; p *= 2) out.push(p);
  return out;
}
`,
    `
List<Long> powersBelow(long n) {
    List<Long> out = new ArrayList<>();
    for (long p = 1; p < n; p *= 2) out.add(p);
    return out;
}
`,
  ),
  snip(
    'count-digits',
    'count decimal digits',
    'O(log n)',
    'Dividing by 10 each pass means the loop runs once per digit, about log₁₀ n times.',
    `
def count_digits(n):
    digits = 1
    while n >= 10:
        n //= 10
        digits += 1
    return digits
`,
    `
function countDigits(n) {
  let digits = 1;
  while (n >= 10) {
    n = Math.floor(n / 10);
    digits++;
  }
  return digits;
}
`,
    `
int countDigits(long n) {
    int digits = 1;
    while (n >= 10) {
        n /= 10;
        digits++;
    }
    return digits;
}
`,
  ),
  snip(
    'fast-pow',
    'exponentiation by squaring',
    'O(log n)',
    'The exponent is halved on every pass. Here n is the exponent, and each multiply is treated as constant time.',
    `
def power(base, exp):
    result = 1
    while exp > 0:
        if exp & 1:
            result *= base
        base *= base
        exp >>= 1
    return result
`,
    `
function power(base, exp) {
  let result = 1;
  while (exp > 0) {
    if (exp & 1) result *= base;
    base *= base;
    exp >>= 1;
  }
  return result;
}
`,
    `
long power(long base, long exp) {
    long result = 1;
    while (exp > 0) {
        if ((exp & 1) == 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}
`,
  ),
  snip(
    'gcd',
    'Euclid’s gcd',
    'O(log n)',
    'The remainder at least halves every two steps, so the loop is logarithmic in the smaller input.',
    `
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
`,
    `
function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
`,
    `
long gcd(long a, long b) {
    while (b != 0) {
        long t = a % b;
        a = b;
        b = t;
    }
    return a;
}
`,
  ),
  snip(
    'lower-bound',
    'first index not below target',
    'O(log n)',
    'The half-open range [lo, hi) shrinks by half on every pass.',
    `
def lower_bound(sorted_items, target):
    lo, hi = 0, len(sorted_items)
    while lo < hi:
        mid = (lo + hi) // 2
        if sorted_items[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
    `
function lowerBound(sorted, target) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
`,
    `
int lowerBound(int[] sorted, int target) {
    int lo = 0, hi = sorted.length;
    while (lo < hi) {
        int mid = (lo + hi) >>> 1;
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
`,
  ),
  snip(
    'to-binary',
    'number to binary string',
    'O(log n)',
    'One bit is produced per iteration, and n has about log₂ n bits.',
    `
def to_binary(n):
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n & 1))
        n >>= 1
    return "".join(reversed(bits))
`,
    `
function toBinary(n) {
  if (n === 0) return "0";
  const bits = [];
  while (n > 0) {
    bits.push(n & 1);
    n >>= 1;
  }
  return bits.reverse().join("");
}
`,
    `
String toBinary(int n) {
    if (n == 0) return "0";
    StringBuilder bits = new StringBuilder();
    while (n > 0) {
        bits.append(n & 1);
        n >>= 1;
    }
    return bits.reverse().toString();
}
`,
  ),
  snip(
    'heap-push',
    'binary heap insert',
    'O(log n)',
    'The new value climbs at most the height of the heap, and a binary heap is log n levels tall.',
    `
def heap_push(heap, value):
    heap.append(value)
    i = len(heap) - 1
    while i > 0:
        parent = (i - 1) // 2
        if heap[parent] <= heap[i]:
            break
        heap[parent], heap[i] = heap[i], heap[parent]
        i = parent
`,
    `
function heapPush(heap, value) {
  heap.push(value);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (heap[parent] <= heap[i]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
  }
}
`,
    `
void heapPush(List<Integer> heap, int value) {
    heap.add(value);
    int i = heap.size() - 1;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap.get(parent) <= heap.get(i)) break;
        Collections.swap(heap, parent, i);
        i = parent;
    }
}
`,
  ),
  snip(
    'bst-search',
    'search a balanced BST',
    'O(log n)',
    'The search drops one level per step, and a balanced tree is log n levels tall. An unbalanced tree could degrade to O(n).',
    `
def contains(node, key):
    # the tree is kept balanced
    while node is not None:
        if key == node.key:
            return True
        node = node.left if key < node.key else node.right
    return False
`,
    `
function contains(node, key) {
  // the tree is kept balanced
  while (node !== null) {
    if (key === node.key) return true;
    node = key < node.key ? node.left : node.right;
  }
  return false;
}
`,
    `
boolean contains(Node node, int key) {
    // the tree is kept balanced
    while (node != null) {
        if (key == node.key) return true;
        node = key < node.key ? node.left : node.right;
    }
    return false;
}
`,
  ),
  snip(
    'isqrt-binary',
    'integer square root by bisection',
    'O(log n)',
    'This binary-searches over 0..n instead of climbing one step at a time. The answer is √n, but finding it takes log n steps.',
    `
def isqrt(n):
    lo, hi = 0, n
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid * mid <= n:
            lo = mid
        else:
            hi = mid - 1
    return lo
`,
    `
function isqrt(n) {
  let lo = 0, hi = n;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (mid * mid <= n) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
`,
    `
long isqrt(long n) {
    long lo = 0, hi = Math.min(n, 3037000499L);
    while (lo < hi) {
        long mid = (lo + hi + 1) / 2;
        if (mid * mid <= n) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
`,
  ),
  snip(
    'mountain-peak',
    'peak of a mountain array',
    'O(log n)',
    'Comparing mid with its right neighbour shows which half holds the peak, so half the range is dropped each time.',
    `
def peak_index(mountain):
    lo, hi = 0, len(mountain) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mountain[mid] < mountain[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,
    `
function peakIndex(mountain) {
  let lo = 0, hi = mountain.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (mountain[mid] < mountain[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
`,
    `
int peakIndex(int[] mountain) {
    int lo = 0, hi = mountain.length - 1;
    while (lo < hi) {
        int mid = (lo + hi) >>> 1;
        if (mountain[mid] < mountain[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
`,
  ),
  snip(
    'fenwick',
    'Fenwick tree prefix sum',
    'O(log n)',
    'Each step clears the lowest set bit of i, and i has at most log n bits.',
    `
def prefix_sum(tree, i):
    total = 0
    while i > 0:
        total += tree[i]
        i -= i & -i
    return total
`,
    `
function prefixSum(tree, i) {
  let total = 0;
  while (i > 0) {
    total += tree[i];
    i -= i & -i;
  }
  return total;
}
`,
    `
long prefixSum(long[] tree, int i) {
    long total = 0;
    while (i > 0) {
        total += tree[i];
        i -= i & -i;
    }
    return total;
}
`,
  ),
];
