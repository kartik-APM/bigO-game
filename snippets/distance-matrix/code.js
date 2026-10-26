function distanceMatrix(points) {
  const n = points.length;
  const d = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      d[i][j] = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
    }
  }
  return d;
}
