function squaresUpTo(n) {
  const out = [];
  for (let i = 1; i * i <= n; i++) out.push(i * i);
  return out;
}
