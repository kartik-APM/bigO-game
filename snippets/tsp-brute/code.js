// permutations(arr) returns every ordering of arr
function shortestTour(dist) {
  const n = dist.length;
  const others = [...Array(n - 1).keys()].map((i) => i + 1);
  let best = Infinity;
  for (const order of permutations(others)) {
    const route = [0, ...order, 0];
    let cost = 0;
    for (let i = 0; i < n; i++) cost += dist[route[i]][route[i + 1]];
    best = Math.min(best, cost);
  }
  return best;
}
