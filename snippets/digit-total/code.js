function totalDigits(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    for (let x = i; x > 0; x = Math.floor(x / 10)) total++;
  }
  return total;
}
