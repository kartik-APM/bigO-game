long long maxSubarraySlow(const vector<int>& nums) {
    long long best = nums[0];
    for (size_t i = 0; i < nums.size(); i++) {
        for (size_t j = i; j < nums.size(); j++) {
            long long s = 0;
            for (size_t k = i; k <= j; k++) s += nums[k];
            best = max(best, s);
        }
    }
    return best;
}
