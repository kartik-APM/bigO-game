// C++ versions, keyed by snippet id. Includes and `using namespace std;` are omitted.
export const CPP_SIMPLE: Record<string, string> = {
  // O(1)
  ends: `
pair<int, int> ends(const vector<int>& items) {
    if (items.empty()) return {-1, -1};
    return {items.front(), items.back()};
}
`,
  warmup: `
long long warmup(long long n) {
    long long total = 0;
    for (int i = 0; i < 100; i++) total += i * n;
    return total;
}
`,
  'swap-ends': `
void swapEnds(vector<int>& items) {
    if (items.size() > 1) swap(items.front(), items.back());
}
`,
  gauss: `
long long sumTo(long long n) {
    return n * (n + 1) / 2;
}
`,
  pow2: `
bool isPowerOfTwo(long long n) {
    return n > 0 && (n & (n - 1)) == 0;
}
`,
  'stack-push': `
int pushAndPeek(vector<int>& stack, int value) {
    stack.push_back(value);
    return stack.back();
}
`,
  'hash-get': `
int priceOf(const unordered_map<string, int>& prices, const string& item) {
    auto it = prices.find(item);
    return it == prices.end() ? 0 : it->second;
}
`,
  neighbours: `
const int DIRS[8][2] = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
                        {0, 1}, {1, -1}, {1, 0}, {1, 1}};

int liveNeighbours(const vector<vector<int>>& grid, int r, int c) {
    int count = 0;
    for (const auto& d : DIRS) {
        int rr = r + d[0], cc = c + d[1];
        if (rr >= 0 && rr < (int)grid.size() && cc >= 0 && cc < (int)grid[0].size()) {
            count += grid[rr][cc];
        }
    }
    return count;
}
`,
  'ring-get': `
int ringGet(const vector<int>& buffer, int head, int k) {
    return buffer[(head + k) % buffer.size()];
}
`,

  // O(log n)
  'binary-search': `
int find(const vector<int>& sorted, int target) {
    int lo = 0, hi = (int)sorted.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (sorted[mid] == target) return mid;
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
`,
  halvings: `
int halvings(long long n) {
    int steps = 0;
    while (n > 1) {
        n /= 2;
        steps++;
    }
    return steps;
}
`,
  'powers-below': `
vector<long long> powersBelow(long long n) {
    vector<long long> out;
    for (long long p = 1; p < n; p *= 2) out.push_back(p);
    return out;
}
`,
  'count-digits': `
int countDigits(long long n) {
    int digits = 1;
    while (n >= 10) {
        n /= 10;
        digits++;
    }
    return digits;
}
`,
  'fast-pow': `
long long power(long long base, long long exp) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}
`,
  gcd: `
long long gcd(long long a, long long b) {
    while (b != 0) {
        long long t = a % b;
        a = b;
        b = t;
    }
    return a;
}
`,
  'lower-bound': `
int lowerBound(const vector<int>& sorted, int target) {
    int lo = 0, hi = (int)sorted.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
`,
  'to-binary': `
string toBinary(unsigned n) {
    if (n == 0) return "0";
    string bits;
    while (n > 0) {
        bits.push_back('0' + (n & 1));
        n >>= 1;
    }
    reverse(bits.begin(), bits.end());
    return bits;
}
`,
  'heap-push': `
void heapPush(vector<int>& heap, int value) {
    heap.push_back(value);
    size_t i = heap.size() - 1;
    while (i > 0) {
        size_t parent = (i - 1) / 2;
        if (heap[parent] <= heap[i]) break;
        swap(heap[parent], heap[i]);
        i = parent;
    }
}
`,
  'bst-search': `
bool contains(const Node* node, int key) {
    // the tree is kept balanced
    while (node != nullptr) {
        if (key == node->key) return true;
        node = key < node->key ? node->left : node->right;
    }
    return false;
}
`,
  'isqrt-binary': `
long long isqrt(long long n) {
    long long lo = 0, hi = min(n, 3037000499LL);
    while (lo < hi) {
        long long mid = (lo + hi + 1) / 2;
        if (mid * mid <= n) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
`,
  'mountain-peak': `
int peakIndex(const vector<int>& mountain) {
    int lo = 0, hi = (int)mountain.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mountain[mid] < mountain[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
`,
  fenwick: `
long long prefixSum(const vector<long long>& tree, int i) {
    long long total = 0;
    while (i > 0) {
        total += tree[i];
        i -= i & -i;
    }
    return total;
}
`,

  // O(√n)
  'is-prime': `
bool isPrime(long long n) {
    if (n < 2) return false;
    for (long long d = 2; d * d <= n; d++) {
        if (n % d == 0) return false;
    }
    return true;
}
`,
  'isqrt-climb': `
long long intSqrt(long long n) {
    long long r = 0;
    while ((r + 1) * (r + 1) <= n) r++;
    return r;
}
`,
  'count-divisors': `
int countDivisors(long long n) {
    int count = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) count += d * d == n ? 1 : 2;
    }
    return count;
}
`,
  'jump-search': `
int jumpSearch(const vector<int>& sorted, int target) {
    int n = sorted.size();
    int step = max(1, (int)sqrt(n));
    int prev = 0;
    while (prev < n && sorted[min(prev + step, n) - 1] < target) prev += step;
    for (int i = prev; i < min(prev + step, n); i++) {
        if (sorted[i] == target) return i;
    }
    return -1;
}
`,
  'squares-up-to': `
vector<long long> squaresUpTo(long long n) {
    vector<long long> out;
    for (long long i = 1; i * i <= n; i++) out.push_back(i * i);
    return out;
}
`,
  'triangular-below': `
vector<long long> triangularUpTo(long long n) {
    vector<long long> out;
    for (long long k = 1, t = 1; t <= n; k++, t += k) out.push_back(t);
    return out;
}
`,
  'factor-pairs': `
vector<pair<long long, long long>> factorPairs(long long n) {
    vector<pair<long long, long long>> pairs;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) pairs.push_back({d, n / d});
    }
    return pairs;
}
`,

  // O(n)
  sum: `
long long total(const vector<int>& nums) {
    long long s = 0;
    for (int x : nums) s += x;
    return s;
}
`,
  'count-max': `
int countMax(const vector<int>& nums) {
    int best = nums[0];
    for (int x : nums) best = max(best, x);
    int count = 0;
    for (int x : nums) if (x == best) count++;
    return count;
}
`,
  'unique-runs': `
int uniqueRuns(const vector<int>& sorted) {
    int runs = 0;
    size_t i = 0;
    while (i < sorted.size()) {
        size_t j = i;
        while (j < sorted.size() && sorted[j] == sorted[i]) j++;
        runs++;
        i = j;
    }
    return runs;
}
`,
  'memo-fib': `
unordered_map<int, long long> memo;

long long fib(int n) {
    if (n < 2) return n;
    auto it = memo.find(n);
    if (it != memo.end()) return it->second;
    long long v = fib(n - 1) + fib(n - 2);
    memo[n] = v;
    return v;
}
`,
  smooth: `
vector<int> smooth(const vector<int>& nums) {
    int n = nums.size();
    vector<int> out(n, 0);
    for (int i = 0; i < n; i++) {
        for (int k = -2; k <= 2; k++) {
            if (i + k >= 0 && i + k < n) out[i] += nums[i + k];
        }
    }
    return out;
}
`,
  reverse: `
void reverseInPlace(vector<int>& items) {
    for (int i = 0, j = (int)items.size() - 1; i < j; i++, j--) {
        swap(items[i], items[j]);
    }
}
`,
  palindrome: `
bool isPalindrome(const string& s) {
    for (int i = 0, j = (int)s.size() - 1; i < j; i++, j--) {
        if (s[i] != s[j]) return false;
    }
    return true;
}
`,
  kadane: `
int maxSubarray(const vector<int>& nums) {
    int best = nums[0], cur = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}
`,
  'pair-sum-set': `
bool hasPairSum(const vector<int>& nums, int target) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(target - x)) return true;
        seen.insert(x);
    }
    return false;
}
`,
  frequencies: `
unordered_map<string, int> frequencies(const vector<string>& words) {
    unordered_map<string, int> counts;
    for (const auto& w : words) counts[w]++;
    return counts;
}
`,
  'prefix-sums': `
vector<long long> prefixSums(const vector<int>& nums) {
    vector<long long> out(nums.size() + 1, 0);
    for (size_t i = 0; i < nums.size(); i++) out[i + 1] = out[i] + nums[i];
    return out;
}
`,
  'window-sum': `
long long maxWindowSum(const vector<int>& nums, int k) {
    long long window = 0;
    for (int i = 0; i < k; i++) window += nums[i];
    long long best = window;
    for (size_t i = k; i < nums.size(); i++) {
        window += nums[i] - nums[i - k];
        best = max(best, window);
    }
    return best;
}
`,
  'linear-search': `
int indexOf(const vector<int>& items, int target) {
    for (size_t i = 0; i < items.size(); i++) {
        if (items[i] == target) return i;
    }
    return -1;
}
`,
  'recursive-sum': `
long long recSum(const vector<int>& nums, size_t i = 0) {
    if (i == nums.size()) return 0;
    return nums[i] + recSum(nums, i + 1);
}
`,
  'factorial-value': `
unsigned long long factorial(int n) {
    unsigned long long result = 1;
    for (int k = 2; k <= n; k++) result *= k;
    return result;
}
`,
  'merge-sorted': `
vector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {
    vector<int> out;
    size_t i = 0, j = 0;
    while (i < a.size() && j < b.size()) out.push_back(a[i] <= b[j] ? a[i++] : b[j++]);
    while (i < a.size()) out.push_back(a[i++]);
    while (j < b.size()) out.push_back(b[j++]);
    return out;
}
`,
  brackets: `
bool balanced(const string& s) {
    stack<char> st;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') {
            st.push(ch);
        } else if (ch == ')' || ch == ']' || ch == '}') {
            char open = ch == ')' ? '(' : ch == ']' ? '[' : '{';
            if (st.empty() || st.top() != open) return false;
            st.pop();
        }
    }
    return st.empty();
}
`,
  'move-zeros': `
void moveZeros(vector<int>& nums) {
    size_t write = 0;
    for (int x : nums) if (x != 0) nums[write++] = x;
    for (size_t i = write; i < nums.size(); i++) nums[i] = 0;
}
`,
  'next-greater': `
vector<int> nextGreater(const vector<int>& nums) {
    vector<int> result(nums.size(), -1);
    vector<int> st;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!st.empty() && nums[st.back()] < nums[i]) {
            result[st.back()] = nums[i];
            st.pop_back();
        }
        st.push_back(i);
    }
    return result;
}
`,
  'dutch-flag': `
void sortColors(vector<int>& nums) {
    int lo = 0, mid = 0, hi = (int)nums.size() - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[hi--]);
    }
}
`,
};
