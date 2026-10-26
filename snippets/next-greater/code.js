function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = [];
  nums.forEach((x, i) => {
    while (stack.length && nums[stack[stack.length - 1]] < x) {
      result[stack.pop()] = x;
    }
    stack.push(i);
  });
  return result;
}
