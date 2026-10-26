long long recSum(const vector<int>& nums, size_t i = 0) {
    if (i == nums.size()) return 0;
    return nums[i] + recSum(nums, i + 1);
}
