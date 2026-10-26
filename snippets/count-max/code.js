function countMax(nums) {
  let best = nums[0];
  for (const x of nums) best = Math.max(best, x);
  let count = 0;
  for (const x of nums) if (x === best) count++;
  return count;
}
