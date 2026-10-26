function indexOf(items, target) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === target) return i;
  }
  return -1;
}
