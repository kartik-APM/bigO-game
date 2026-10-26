function bestUnder(nums, limit) {
  const n = nums.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if ((mask >> i) & 1) s += nums[i];
    if (s <= limit) best = Math.max(best, s);
  }
  return best;
}
