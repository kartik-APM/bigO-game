function countDivisors(n) {
  let count = 0;
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) count += d * d === n ? 1 : 2;
  }
  return count;
}
