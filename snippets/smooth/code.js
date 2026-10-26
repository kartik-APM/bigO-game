function smooth(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    let s = 0;
    for (let k = -2; k <= 2; k++) {
      if (i + k >= 0 && i + k < nums.length) s += nums[i + k];
    }
    out.push(s);
  }
  return out;
}
