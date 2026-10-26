function ends(items) {
  if (items.length === 0) return null;
  return [items[0], items[items.length - 1]];
}
