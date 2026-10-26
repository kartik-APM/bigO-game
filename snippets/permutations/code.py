def permutations(items):
    if len(items) <= 1:
        return [items]
    out = []
    for i in range(len(items)):
        rest = items[:i] + items[i + 1:]
        for p in permutations(rest):
            out.append([items[i]] + p)
    return out
