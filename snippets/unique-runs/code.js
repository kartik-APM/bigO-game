function uniqueRuns(sorted) {
  let runs = 0;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j] === sorted[i]) j++;
    runs++;
    i = j;
  }
  return runs;
}
