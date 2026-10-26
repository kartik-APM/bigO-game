int peakIndex(int[] mountain) {
    int lo = 0, hi = mountain.length - 1;
    while (lo < hi) {
        int mid = (lo + hi) >>> 1;
        if (mountain[mid] < mountain[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
