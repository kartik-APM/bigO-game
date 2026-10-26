function staircase(n) {
  const rows = [];
  for (let i = 0; i < n; i++) rows.push("#".repeat(i + 1));
  return rows;
}
