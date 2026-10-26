function hasPairSum(nums, target) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(target - x)) return true;
    seen.add(x);
  }
  return false;
}
