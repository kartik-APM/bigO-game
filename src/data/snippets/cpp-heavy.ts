// C++ versions, keyed by snippet id. Includes and `using namespace std;` are omitted.
export const CPP_HEAVY: Record<string, string> = {
  // O(n log n)
  'has-duplicate': `
bool hasDuplicate(vector<int> nums) {
    sort(nums.begin(), nums.end());
    for (size_t i = 1; i < nums.size(); i++) {
        if (nums[i] == nums[i - 1]) return true;
    }
    return false;
}
`,
  'linear-times-doubling': `
long long countSteps(int n) {
    long long count = 0;
    for (int i = 0; i < n; i++) {
        for (long long j = 1; j < n; j *= 2) count++;
    }
    return count;
}
`,
  'merge-sort': `
vector<int> mergeSort(const vector<int>& a) {
    if (a.size() <= 1) return a;
    size_t mid = a.size() / 2;
    vector<int> left = mergeSort(vector<int>(a.begin(), a.begin() + mid));
    vector<int> right = mergeSort(vector<int>(a.begin() + mid, a.end()));
    vector<int> out;
    size_t i = 0, j = 0;
    while (i < left.size() && j < right.size())
        out.push_back(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < left.size()) out.push_back(left[i++]);
    while (j < right.size()) out.push_back(right[j++]);
    return out;
}
`,
  'heap-sort': `
vector<int> heapSorted(const vector<int>& nums) {
    priority_queue<int, vector<int>, greater<int>> heap;
    for (int x : nums) heap.push(x);
    vector<int> out;
    while (!heap.empty()) {
        out.push_back(heap.top());
        heap.pop();
    }
    return out;
}
`,
  'search-each': `
int commonCount(const vector<int>& a, const vector<int>& sortedB) {
    int count = 0;
    for (int x : a) {
        if (binary_search(sortedB.begin(), sortedB.end(), x)) count++;
    }
    return count;
}
`,
  'merge-intervals': `
vector<pair<int, int>> mergeIntervals(vector<pair<int, int>> intervals) {
    sort(intervals.begin(), intervals.end());
    vector<pair<int, int>> out;
    for (auto [start, finish] : intervals) {
        if (!out.empty() && start <= out.back().second)
            out.back().second = max(out.back().second, finish);
        else
            out.push_back({start, finish});
    }
    return out;
}
`,
  harmonic: `
vector<int> divisorCounts(int n) {
    vector<int> counts(n + 1, 0);
    for (int d = 1; d <= n; d++) {
        for (int m = d; m <= n; m += d) counts[m]++;
    }
    return counts;
}
`,
  'meeting-rooms': `
int roomsNeeded(const vector<pair<int, int>>& meetings) {
    vector<int> starts, ends;
    for (auto [s, e] : meetings) {
        starts.push_back(s);
        ends.push_back(e);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int rooms = 0, best = 0;
    size_t j = 0;
    for (int s : starts) {
        while (j < ends.size() && ends[j] <= s) {
            rooms--;
            j++;
        }
        rooms++;
        best = max(best, rooms);
    }
    return best;
}
`,
  'lis-tails': `
int lisLength(const vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}
`,
  'digit-total': `
long long totalDigits(int n) {
    long long total = 0;
    for (int i = 1; i <= n; i++) {
        for (int x = i; x > 0; x /= 10) total++;
    }
    return total;
}
`,
  'pairs-below': `
long long pairsBelow(vector<int> nums, int limit) {
    sort(nums.begin(), nums.end());
    int i = 0, j = (int)nums.size() - 1;
    long long count = 0;
    while (i < j) {
        if (nums[i] + nums[j] < limit) {
            count += j - i;
            i++;
        } else {
            j--;
        }
    }
    return count;
}
`,
  'by-frequency': `
vector<string> byFrequency(const vector<string>& words) {
    unordered_map<string, int> counts;
    for (const auto& w : words) counts[w]++;
    vector<string> keys;
    for (const auto& entry : counts) keys.push_back(entry.first);
    sort(keys.begin(), keys.end(), [&](const string& a, const string& b) {
        return counts[a] > counts[b];
    });
    return keys;
}
`,
  'doubling-passes': `
long long weightedPasses(const vector<int>& a) {
    long long work = 0;
    for (size_t width = 1; width < a.size(); width *= 2) {
        for (size_t i = 0; i < a.size(); i++) work += a[i] * (long long)width;
    }
    return work;
}
`,

  // O(n²)
  'equal-pairs': `
int countEqualPairs(const vector<int>& xs) {
    int n = xs.size(), count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j && xs[i] == xs[j]) count++;
        }
    }
    return count;
}
`,
  'pair-sum-brute': `
bool hasPairSum(const vector<int>& xs, int target) {
    for (size_t i = 0; i < xs.size(); i++) {
        for (size_t j = i + 1; j < xs.size(); j++) {
            if (xs[i] + xs[j] == target) return true;
        }
    }
    return false;
}
`,
  bubble: `
void bubble(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) swap(a[j], a[j + 1]);
        }
    }
}
`,
  selection: `
void selectionSort(vector<int>& a) {
    for (size_t i = 0; i < a.size(); i++) {
        size_t smallest = i;
        for (size_t j = i + 1; j < a.size(); j++) {
            if (a[j] < a[smallest]) smallest = j;
        }
        swap(a[i], a[smallest]);
    }
}
`,
  insertion: `
void insertionSort(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); i++) {
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
  'distance-matrix': `
vector<vector<double>> distanceMatrix(const vector<pair<double, double>>& pts) {
    size_t n = pts.size();
    vector<vector<double>> d(n, vector<double>(n));
    for (size_t i = 0; i < n; i++) {
        for (size_t j = 0; j < n; j++) {
            d[i][j] = hypot(pts[i].first - pts[j].first, pts[i].second - pts[j].second);
        }
    }
    return d;
}
`,
  'grid-sum': `
long long brightness(const vector<vector<int>>& image) {
    // image is n × n pixels
    long long total = 0;
    for (const auto& row : image) {
        for (int px : row) total += px;
    }
    return total;
}
`,
  lcs: `
int lcsLength(const string& a, const string& b) {
    vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1, 0));
    for (size_t i = 1; i <= a.size(); i++) {
        for (size_t j = 1; j <= b.size(); j++) {
            dp[i][j] = a[i - 1] == b[j - 1]
                ? dp[i - 1][j - 1] + 1
                : max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[a.size()][b.size()];
}
`,
  inversions: `
long long inversions(const vector<int>& a) {
    long long count = 0;
    for (size_t i = 0; i < a.size(); i++) {
        for (size_t j = i + 1; j < a.size(); j++) {
            if (a[i] > a[j]) count++;
        }
    }
    return count;
}
`,
  'dedupe-list': `
vector<int> dedupe(const vector<int>& items) {
    vector<int> out;
    for (int x : items) {
        if (find(out.begin(), out.end(), x) == out.end()) out.push_back(x);
    }
    return out;
}
`,
  'palindromic-substrings': `
int countPalindromes(const string& s) {
    int n = s.size(), count = 0;
    for (int center = 0; center < 2 * n - 1; center++) {
        int lo = center / 2;
        int hi = lo + center % 2;
        while (lo >= 0 && hi < n && s[lo] == s[hi]) {
            count++;
            lo--;
            hi++;
        }
    }
    return count;
}
`,
  'three-sum': `
bool hasZeroTriple(vector<int> nums) {
    sort(nums.begin(), nums.end());
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        int lo = i + 1, hi = n - 1;
        while (lo < hi) {
            int total = nums[i] + nums[lo] + nums[hi];
            if (total == 0) return true;
            if (total < 0) lo++;
            else hi--;
        }
    }
    return false;
}
`,
  staircase: `
vector<string> staircase(int n) {
    vector<string> rows;
    for (int i = 0; i < n; i++) rows.push_back(string(i + 1, '#'));
    return rows;
}
`,
  'drain-front': `
vector<int> drain(vector<int>& items) {
    vector<int> order;
    while (!items.empty()) {
        order.push_back(items.front());
        items.erase(items.begin());
    }
    return order;
}
`,

  // O(n³)
  matmul: `
vector<vector<long long>> matmul(const vector<vector<long long>>& A,
                                 const vector<vector<long long>>& B) {
    size_t n = A.size();
    vector<vector<long long>> C(n, vector<long long>(n, 0));
    for (size_t i = 0; i < n; i++)
        for (size_t j = 0; j < n; j++)
            for (size_t k = 0; k < n; k++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}
`,
  'zero-triplets': `
int zeroTriplets(const vector<int>& nums) {
    int n = nums.size(), count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            for (int k = j + 1; k < n; k++)
                if (nums[i] + nums[j] + nums[k] == 0) count++;
    return count;
}
`,
  'floyd-warshall': `
void allPairsShortest(vector<vector<long long>>& dist) {
    size_t n = dist.size();
    for (size_t k = 0; k < n; k++)
        for (size_t i = 0; i < n; i++)
            for (size_t j = 0; j < n; j++)
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
}
`,
  'subarray-recompute': `
long long maxSubarraySlow(const vector<int>& nums) {
    long long best = nums[0];
    for (size_t i = 0; i < nums.size(); i++) {
        for (size_t j = i; j < nums.size(); j++) {
            long long s = 0;
            for (size_t k = i; k <= j; k++) s += nums[k];
            best = max(best, s);
        }
    }
    return best;
}
`,
  triangles: `
int countTriangles(const vector<vector<bool>>& adj) {
    int n = adj.size(), count = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (adj[i][j])
                for (int k = j + 1; k < n; k++)
                    if (adj[j][k] && adj[i][k]) count++;
    return count;
}
`,
  'longest-palindrome-brute': `
string longestPalindrome(const string& s) {
    string best;
    for (size_t i = 0; i < s.size(); i++) {
        for (size_t j = i + 1; j <= s.size(); j++) {
            string sub = s.substr(i, j - i);
            string rev(sub.rbegin(), sub.rend());
            if (sub == rev && sub.size() > best.size()) best = sub;
        }
    }
    return best;
}
`,
  'matrix-chain': `
long long chainCost(const vector<int>& dims) {
    int n = dims.size() - 1;
    vector<vector<long long>> cost(n, vector<long long>(n, 0));
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            cost[i][j] = LLONG_MAX;
            for (int k = i; k < j; k++) {
                long long c = cost[i][k] + cost[k + 1][j]
                    + 1LL * dims[i] * dims[k + 1] * dims[j + 1];
                cost[i][j] = min(cost[i][j], c);
            }
        }
    }
    return cost[0][n - 1];
}
`,

  // O(2ⁿ)
  'naive-fib': `
long long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}
`,
  'count-subsets': `
int countSubsets(const vector<int>& nums, int target, size_t i = 0) {
    if (i == nums.size()) return target == 0 ? 1 : 0;
    int take = countSubsets(nums, target - nums[i], i + 1);
    int skip = countSubsets(nums, target, i + 1);
    return take + skip;
}
`,
  'power-set': `
vector<vector<int>> powerSet(const vector<int>& items, size_t i = 0) {
    if (i == items.size()) return {{}};
    vector<vector<int>> rest = powerSet(items, i + 1);
    vector<vector<int>> out = rest;
    for (auto s : rest) {
        s.insert(s.begin(), items[i]);
        out.push_back(s);
    }
    return out;
}
`,
  hanoi: `
void hanoi(int n, int src, int dst, int via, vector<pair<int, int>>& moves) {
    if (n == 0) return;
    hanoi(n - 1, src, via, dst, moves);
    moves.push_back({src, dst});
    hanoi(n - 1, via, dst, src, moves);
}
`,
  'binary-strings': `
void binaryStrings(int n, const string& prefix, vector<string>& out) {
    if ((int)prefix.size() == n) {
        out.push_back(prefix);
        return;
    }
    binaryStrings(n, prefix + "0", out);
    binaryStrings(n, prefix + "1", out);
}
`,
  'no-adjacent-masks': `
int noAdjacentOnes(int n) {
    int count = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if ((mask & (mask >> 1)) == 0) count++;
    }
    return count;
}
`,
  'knapsack-naive': `
int bestValue(const vector<int>& w, const vector<int>& v, int cap, size_t i = 0) {
    if (i == w.size()) return 0;
    int skip = bestValue(w, v, cap, i + 1);
    if (w[i] > cap) return skip;
    int take = v[i] + bestValue(w, v, cap - w[i], i + 1);
    return max(skip, take);
}
`,
  'gray-code': `
vector<int> grayCode(int n) {
    vector<int> out;
    for (int i = 0; i < (1 << n); i++) out.push_back(i ^ (i >> 1));
    return out;
}
`,
  'best-under-limit': `
int bestUnder(const vector<int>& nums, int limit) {
    int n = nums.size(), best = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) if ((mask >> i) & 1) s += nums[i];
        if (s <= limit) best = max(best, s);
    }
    return best;
}
`,

  // O(n!)
  permutations: `
vector<vector<int>> permutations(const vector<int>& items) {
    if (items.size() <= 1) return {items};
    vector<vector<int>> out;
    for (size_t i = 0; i < items.size(); i++) {
        vector<int> rest = items;
        rest.erase(rest.begin() + i);
        for (auto& p : permutations(rest)) {
            p.insert(p.begin(), items[i]);
            out.push_back(p);
        }
    }
    return out;
}
`,
  'tsp-brute': `
int shortestTour(const vector<vector<int>>& dist) {
    int n = dist.size();
    vector<int> order;
    for (int i = 1; i < n; i++) order.push_back(i);
    int best = INT_MAX;
    do {
        int cost = 0, at = 0;
        for (int city : order) {
            cost += dist[at][city];
            at = city;
        }
        best = min(best, cost + dist[at][0]);
    } while (next_permutation(order.begin(), order.end()));
    return best;
}
`,
  anagrams: `
void anagrams(const string& word, string& prefix, vector<bool>& used,
              vector<string>& out) {
    if (prefix.size() == word.size()) {
        out.push_back(prefix);
        return;
    }
    for (size_t i = 0; i < word.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        prefix.push_back(word[i]);
        anagrams(word, prefix, used, out);
        prefix.pop_back();
        used[i] = false;
    }
}
`,
  'n-queens': `
int place(int row, int n, vector<bool>& cols, vector<bool>& d1, vector<bool>& d2) {
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
  'heaps-algorithm': `
void heaps(vector<int>& a, int k, vector<vector<int>>& out) {
    if (k == 1) {
        out.push_back(a);
        return;
    }
    for (int i = 0; i < k - 1; i++) {
        heaps(a, k - 1, out);
        swap(a[k % 2 == 0 ? i : 0], a[k - 1]);
    }
    heaps(a, k - 1, out);
}
`,
  'factorial-tree': `
long long f(int n) {
    if (n == 0) return 1;
    long long total = 0;
    for (int i = 0; i < n; i++) total += f(n - 1);
    return total;
}
`,
  'next-perm-loop': `
long long countOrderings(vector<int> a) {
    sort(a.begin(), a.end());
    long long count = 0;
    do {
        count++;
    } while (next_permutation(a.begin(), a.end()));  // O(n) per step
    return count;
}
`,
  'derangements-brute': `
long long go(vector<int>& a, size_t i) {
    if (i == a.size()) return 1;
    long long total = 0;
    for (size_t j = i; j < a.size(); j++) {
        swap(a[i], a[j]);
        if (a[i] != (int)i) total += go(a, i + 1);
        swap(a[i], a[j]);
    }
    return total;
}
`,
};
