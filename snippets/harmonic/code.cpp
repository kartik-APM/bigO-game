vector<int> divisorCounts(int n) {
    vector<int> counts(n + 1, 0);
    for (int d = 1; d <= n; d++) {
        for (int m = d; m <= n; m += d) counts[m]++;
    }
    return counts;
}
