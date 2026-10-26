function permutations(items) {
  if (items.length <= 1) return [items];
  const out = [];
  items.forEach((first, i) => {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) out.push([first, ...p]);
  });
  return out;
}
