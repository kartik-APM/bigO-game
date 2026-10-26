function pairsBelow(nums, limit) {
  const s = [...nums].sort((a, b) => a - b);
  let i = 0, j = s.length - 1, count = 0;
  while (i < j) {
    if (s[i] + s[j] < limit) {
      count += j - i;
      i++;
    } else {
      j--;
    }
  }
  return count;
}
