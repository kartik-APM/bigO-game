long chainCost(int[] dims) {
    int n = dims.length - 1;
    long[][] cost = new long[n][n];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            cost[i][j] = Long.MAX_VALUE;
            for (int k = i; k < j; k++) {
                long c = cost[i][k] + cost[k + 1][j] + (long) dims[i] * dims[k + 1] * dims[j + 1];
                cost[i][j] = Math.min(cost[i][j], c);
            }
        }
    }
    return cost[0][n - 1];
}
