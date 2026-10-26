function hasZeroTriple(nums) {
  const s = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < s.length - 2; i++) {
    let lo = i + 1, hi = s.length - 1;
    while (lo < hi) {
      const total = s[i] + s[lo] + s[hi];
      if (total === 0) return true;
      if (total < 0) lo++;
      else hi--;
    }
  }
  return false;
}
