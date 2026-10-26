function countTriangles(adj) {
  const n = adj.length;
  let count = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (adj[i][j])
        for (let k = j + 1; k < n; k++)
          if (adj[j][k] && adj[i][k]) count++;
  return count;
}
