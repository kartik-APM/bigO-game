function factorPairs(n) {
  const pairs = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) pairs.push([d, n / d]);
  }
  return pairs;
}
