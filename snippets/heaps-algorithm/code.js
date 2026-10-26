function heaps(a, k, out) {
  if (k === 1) {
    out.push([...a]);
    return;
  }
  for (let i = 0; i < k - 1; i++) {
    heaps(a, k - 1, out);
    const j = k % 2 === 0 ? i : 0;
    [a[j], a[k - 1]] = [a[k - 1], a[j]];
  }
  heaps(a, k - 1, out);
}
