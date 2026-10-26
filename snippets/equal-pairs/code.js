function countEqualPairs(xs) {
  let count = 0;
  for (let i = 0; i < xs.length; i++) {
    for (let j = 0; j < xs.length; j++) {
      if (i !== j && xs[i] === xs[j]) count++;
    }
  }
  return count;
}
