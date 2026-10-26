vector<pair<long long, long long>> factorPairs(long long n) {
    vector<pair<long long, long long>> pairs;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) pairs.push_back({d, n / d});
    }
    return pairs;
}
