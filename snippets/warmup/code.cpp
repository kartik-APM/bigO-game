long long warmup(long long n) {
    long long total = 0;
    for (int i = 0; i < 100; i++) total += i * n;
    return total;
}
