function hasDuplicate(nums) {
  const s = [...nums].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) return true;
  }
  return false;
}
