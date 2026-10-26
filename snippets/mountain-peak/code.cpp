int peakIndex(const vector<int>& mountain) {
    int lo = 0, hi = (int)mountain.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mountain[mid] < mountain[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
