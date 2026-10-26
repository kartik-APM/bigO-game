function maxSubarraySlow(nums) {
  let best = nums[0];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      let s = 0;
      for (let k = i; k <= j; k++) s += nums[k];
      best = Math.max(best, s);
    }
  }
  return best;
}
