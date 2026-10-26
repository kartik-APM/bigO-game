import math

def jump_search(sorted_items, target):
    n = len(sorted_items)
    step = max(1, math.isqrt(n))
    prev = 0
    while prev < n and sorted_items[min(prev + step, n) - 1] < target:
        prev += step
    for i in range(prev, min(prev + step, n)):
        if sorted_items[i] == target:
            return i
    return -1
