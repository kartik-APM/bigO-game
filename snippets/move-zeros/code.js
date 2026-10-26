function moveZeros(nums) {
  let write = 0;
  for (const x of nums) if (x !== 0) nums[write++] = x;
  for (let i = write; i < nums.length; i++) nums[i] = 0;
  return nums;
}
