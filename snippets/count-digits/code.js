function countDigits(n) {
  let digits = 1;
  while (n >= 10) {
    n = Math.floor(n / 10);
    digits++;
  }
  return digits;
}
