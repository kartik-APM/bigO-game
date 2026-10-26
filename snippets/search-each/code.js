function commonCount(a, sortedB) {
  let count = 0;
  for (const x of a) {
    let lo = 0, hi = sortedB.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sortedB[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (sortedB[lo] === x) count++;
  }
  return count;
}
