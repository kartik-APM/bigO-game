function countQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const place = (row) => {
    if (row === n) return 1;
    let total = 0;
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(row + c) || d2.has(row - c)) continue;
      cols.add(c); d1.add(row + c); d2.add(row - c);
      total += place(row + 1);
      cols.delete(c); d1.delete(row + c); d2.delete(row - c);
    }
    return total;
  };
  return place(0);
}
