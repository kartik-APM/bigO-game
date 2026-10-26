function noAdjacentOnes(n) {
  let count = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    if ((mask & (mask >> 1)) === 0) count++;
  }
  return count;
}
