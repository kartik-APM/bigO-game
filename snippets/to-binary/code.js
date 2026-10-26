function toBinary(n) {
  if (n === 0) return "0";
  const bits = [];
  while (n > 0) {
    bits.push(n & 1);
    n >>= 1;
  }
  return bits.reverse().join("");
}
