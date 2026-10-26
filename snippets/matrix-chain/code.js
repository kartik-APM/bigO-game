function chainCost(dims) {
  const n = dims.length - 1;
  const cost = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      cost[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const c = cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        cost[i][j] = Math.min(cost[i][j], c);
      }
    }
  }
  return cost[0][n - 1];
}
