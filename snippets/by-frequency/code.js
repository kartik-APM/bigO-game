function byFrequency(words) {
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
}
