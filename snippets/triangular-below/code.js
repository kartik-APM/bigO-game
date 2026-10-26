function triangularUpTo(n) {
  const out = [];
  for (let k = 1, t = 1; t <= n; k++, t += k) out.push(t);
  return out;
}
