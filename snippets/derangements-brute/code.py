def derangements(n):
    a = list(range(n))

    def go(i):
        if i == n:
            return 1
        total = 0
        for j in range(i, n):
            a[i], a[j] = a[j], a[i]
            if a[i] != i:
                total += go(i + 1)
            a[i], a[j] = a[j], a[i]
        return total

    return go(0)
