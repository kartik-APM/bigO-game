function countSubsets(nums, target, i = 0) {
  if (i === nums.length) return target === 0 ? 1 : 0;
  const take = countSubsets(nums, target - nums[i], i + 1);
  const skip = countSubsets(nums, target, i + 1);
  return take + skip;
}
