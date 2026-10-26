def f(n):
    if n == 0:
        return 1
    total = 0
    for _ in range(n):
        total += f(n - 1)
    return total
