unordered_map<int, long long> memo;

long long fib(int n) {
    if (n < 2) return n;
    auto it = memo.find(n);
    if (it != memo.end()) return it->second;
    long long v = fib(n - 1) + fib(n - 2);
    memo[n] = v;
    return v;
}
