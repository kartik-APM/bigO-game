int bestUnder(const vector<int>& nums, int limit) {
    int n = nums.size(), best = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) if ((mask >> i) & 1) s += nums[i];
        if (s <= limit) best = max(best, s);
    }
    return best;
}
