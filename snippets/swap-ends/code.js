function swapEnds(items) {
  if (items.length > 1) {
    const last = items.length - 1;
    [items[0], items[last]] = [items[last], items[0]];
  }
  return items;
}
