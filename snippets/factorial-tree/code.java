long f(int n) {
    if (n == 0) return 1;
    long total = 0;
    for (int i = 0; i < n; i++) total += f(n - 1);
    return total;
}
