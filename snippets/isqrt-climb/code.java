long intSqrt(long n) {
    long r = 0;
    while ((r + 1) * (r + 1) <= n) r++;
    return r;
}
