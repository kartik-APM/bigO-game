int lowerBound(int[] sorted, int target) {
    int lo = 0, hi = sorted.length;
    while (lo < hi) {
        int mid = (lo + hi) >>> 1;
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
