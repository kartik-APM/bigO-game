function recSum(nums, i = 0) {
  if (i === nums.length) return 0;
  return nums[i] + recSum(nums, i + 1);
}
