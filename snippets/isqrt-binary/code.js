function isqrt(n) {
  let lo = 0, hi = n;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (mid * mid <= n) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
