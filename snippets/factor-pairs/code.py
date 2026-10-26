def factor_pairs(n):
    pairs = []
    d = 1
    while d * d <= n:
        if n % d == 0:
            pairs.append((d, n // d))
        d += 1
    return pairs
