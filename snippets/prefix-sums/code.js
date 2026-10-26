function prefixSums(nums) {
  const out = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) out[i + 1] = out[i] + nums[i];
  return out;
}
