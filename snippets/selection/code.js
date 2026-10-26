function selectionSort(a) {
  for (let i = 0; i < a.length; i++) {
    let smallest = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[smallest]) smallest = j;
    }
    [a[i], a[smallest]] = [a[smallest], a[i]];
  }
  return a;
}
