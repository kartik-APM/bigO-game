def frequencies(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts
