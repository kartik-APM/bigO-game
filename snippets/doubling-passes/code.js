function weightedPasses(a) {
  let work = 0;
  for (let width = 1; width < a.length; width *= 2) {
    for (let i = 0; i < a.length; i++) work += a[i] * width;
  }
  return work;
}
