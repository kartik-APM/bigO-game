int[] divisorCounts(int n) {
    int[] counts = new int[n + 1];
    for (int d = 1; d <= n; d++) {
        for (int m = d; m <= n; m += d) counts[m]++;
    }
    return counts;
}
