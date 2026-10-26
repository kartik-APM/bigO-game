int lowerBound(const vector<int>& sorted, int target) {
    int lo = 0, hi = (int)sorted.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
