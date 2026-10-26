int jumpSearch(int[] sorted, int target) {
    int n = sorted.length;
    int step = Math.max(1, (int) Math.sqrt(n));
    int prev = 0;
    while (prev < n && sorted[Math.min(prev + step, n) - 1] < target) prev += step;
    for (int i = prev; i < Math.min(prev + step, n); i++) {
        if (sorted[i] == target) return i;
    }
    return -1;
}
