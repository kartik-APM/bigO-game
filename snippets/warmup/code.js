function warmup(n) {
  let total = 0;
  for (let i = 0; i < 100; i++) total += i * n;
  return total;
}
