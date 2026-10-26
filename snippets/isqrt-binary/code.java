long isqrt(long n) {
    long lo = 0, hi = Math.min(n, 3037000499L);
    while (lo < hi) {
        long mid = (lo + hi + 1) / 2;
        if (mid * mid <= n) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
