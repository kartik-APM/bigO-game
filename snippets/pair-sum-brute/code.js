function hasPairSum(xs, target) {
  for (let i = 0; i < xs.length; i++) {
    for (let j = i + 1; j < xs.length; j++) {
      if (xs[i] + xs[j] === target) return true;
    }
  }
  return false;
}
