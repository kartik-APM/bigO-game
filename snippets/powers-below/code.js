function powersBelow(n) {
  const out = [];
  for (let p = 1; p < n; p *= 2) out.push(p);
  return out;
}
