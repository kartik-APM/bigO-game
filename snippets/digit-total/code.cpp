long long totalDigits(int n) {
    long long total = 0;
    for (int i = 1; i <= n; i++) {
        for (int x = i; x > 0; x /= 10) total++;
    }
    return total;
}
