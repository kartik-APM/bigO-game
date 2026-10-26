int bestUnder(int[] nums, int limit) {
    int n = nums.length, best = 0;
    for (int mask = 0; mask < 1 << n; mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) if (((mask >> i) & 1) == 1) s += nums[i];
        if (s <= limit) best = Math.max(best, s);
    }
    return best;
}
