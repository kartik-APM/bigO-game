function intSqrt(n) {
  let r = 0;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
}
