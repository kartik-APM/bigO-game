long long maxWindowSum(const vector<int>& nums, int k) {
    long long window = 0;
    for (int i = 0; i < k; i++) window += nums[i];
    long long best = window;
    for (size_t i = k; i < nums.size(); i++) {
        window += nums[i] - nums[i - k];
        best = max(best, window);
    }
    return best;
}
