def by_frequency(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return sorted(counts, key=lambda w: -counts[w])
