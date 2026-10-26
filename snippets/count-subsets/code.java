int countSubsets(int[] nums, int target, int i) {
    if (i == nums.length) return target == 0 ? 1 : 0;
    int take = countSubsets(nums, target - nums[i], i + 1);
    int skip = countSubsets(nums, target, i + 1);
    return take + skip;
}
