long long intSqrt(long long n) {
    long long r = 0;
    while ((r + 1) * (r + 1) <= n) r++;
    return r;
}
