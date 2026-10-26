function f(n) {
  if (n === 0) return 1;
  let total = 0;
  for (let i = 0; i < n; i++) total += f(n - 1);
  return total;
}
