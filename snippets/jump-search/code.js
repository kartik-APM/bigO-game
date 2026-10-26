function jumpSearch(sorted, target) {
  const n = sorted.length;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0;
  while (prev < n && sorted[Math.min(prev + step, n) - 1] < target) prev += step;
  for (let i = prev; i < Math.min(prev + step, n); i++) {
    if (sorted[i] === target) return i;
  }
  return -1;
}
