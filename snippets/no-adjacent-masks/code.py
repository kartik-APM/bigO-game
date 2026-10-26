def no_adjacent_ones(n):
    count = 0
    for mask in range(1 << n):
        if (mask & (mask >> 1)) == 0:
            count += 1
    return count
