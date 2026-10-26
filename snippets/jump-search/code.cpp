int jumpSearch(const vector<int>& sorted, int target) {
    int n = sorted.size();
    int step = max(1, (int)sqrt(n));
    int prev = 0;
    while (prev < n && sorted[min(prev + step, n) - 1] < target) prev += step;
    for (int i = prev; i < min(prev + step, n); i++) {
        if (sorted[i] == target) return i;
    }
    return -1;
}
