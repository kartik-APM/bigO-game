long recSum(int[] nums, int i) {
    if (i == nums.length) return 0;
    return nums[i] + recSum(nums, i + 1);
}
