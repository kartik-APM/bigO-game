long long chainCost(const vector<int>& dims) {
    int n = dims.size() - 1;
    vector<vector<long long>> cost(n, vector<long long>(n, 0));
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            cost[i][j] = LLONG_MAX;
            for (int k = i; k < j; k++) {
                long long c = cost[i][k] + cost[k + 1][j]
                    + 1LL * dims[i] * dims[k + 1] * dims[j + 1];
                cost[i][j] = min(cost[i][j], c);
            }
        }
    }
    return cost[0][n - 1];
}
