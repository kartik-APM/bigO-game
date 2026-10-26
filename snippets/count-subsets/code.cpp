int countSubsets(const vector<int>& nums, int target, size_t i = 0) {
    if (i == nums.size()) return target == 0 ? 1 : 0;
    int take = countSubsets(nums, target - nums[i], i + 1);
    int skip = countSubsets(nums, target, i + 1);
    return take + skip;
}
