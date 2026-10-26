def divisor_counts(n):
    counts = [0] * (n + 1)
    for d in range(1, n + 1):
        for multiple in range(d, n + 1, d):
            counts[multiple] += 1
    return counts
