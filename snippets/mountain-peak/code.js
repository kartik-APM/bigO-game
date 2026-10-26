function peakIndex(mountain) {
  let lo = 0, hi = mountain.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (mountain[mid] < mountain[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
