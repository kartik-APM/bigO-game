int countEqualPairs(const vector<int>& xs) {
    int n = xs.size(), count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j && xs[i] == xs[j]) count++;
        }
    }
    return count;
}
