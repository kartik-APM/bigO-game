def total_digits(n):
    total = 0
    for i in range(1, n + 1):
        x = i
        while x > 0:
            x //= 10
            total += 1
    return total
