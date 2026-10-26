function powerSet(items) {
  if (items.length === 0) return [[]];
  const rest = powerSet(items.slice(1));
  return rest.concat(rest.map((s) => [items[0], ...s]));
}
