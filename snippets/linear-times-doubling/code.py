def count_steps(n):
    count = 0
    for i in range(n):
        j = 1
        while j < n:
            count += 1
            j *= 2
    return count
