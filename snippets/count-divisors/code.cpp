int countDivisors(long long n) {
    int count = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) count += d * d == n ? 1 : 2;
    }
    return count;
}
