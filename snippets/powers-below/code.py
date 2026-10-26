def powers_below(n):
    out = []
    p = 1
    while p < n:
        out.append(p)
        p *= 2
    return out
