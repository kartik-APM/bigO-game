function divisorCounts(n) {
  const counts = new Array(n + 1).fill(0);
  for (let d = 1; d <= n; d++) {
    for (let m = d; m <= n; m += d) counts[m]++;
  }
  return counts;
}
