long long isqrt(long long n) {
    long long lo = 0, hi = min(n, 3037000499LL);
    while (lo < hi) {
        long long mid = (lo + hi + 1) / 2;
        if (mid * mid <= n) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
