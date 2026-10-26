function roomsNeeded(meetings) {
  const starts = meetings.map((m) => m[0]).sort((a, b) => a - b);
  const ends = meetings.map((m) => m[1]).sort((a, b) => a - b);
  let rooms = 0, best = 0, j = 0;
  for (const s of starts) {
    while (j < ends.length && ends[j] <= s) {
      rooms--;
      j++;
    }
    rooms++;
    best = Math.max(best, rooms);
  }
  return best;
}
