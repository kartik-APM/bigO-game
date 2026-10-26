function derangements(n) {
  const a = [...Array(n).keys()];
  const go = (i) => {
    if (i === n) return 1;
    let total = 0;
    for (let j = i; j < n; j++) {
      [a[i], a[j]] = [a[j], a[i]];
      if (a[i] !== i) total += go(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return total;
  };
  return go(0);
}
