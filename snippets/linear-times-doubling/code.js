function countSteps(n) {
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j *= 2) count++;
  }
  return count;
}
