def rooms_needed(meetings):
    starts = sorted(s for s, _ in meetings)
    ends = sorted(e for _, e in meetings)
    rooms = best = 0
    j = 0
    for s in starts:
        while j < len(ends) and ends[j] <= s:
            rooms -= 1
            j += 1
        rooms += 1
        best = max(best, rooms)
    return best
