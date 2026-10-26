function reverse(items) {
  for (let i = 0, j = items.length - 1; i < j; i++, j--) {
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
