function dedupe(items) {
  const out = [];
  for (const x of items) {
    if (!out.includes(x)) out.push(x);
  }
  return out;
}
