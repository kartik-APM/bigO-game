def best_under(nums, limit):
    n = len(nums)
    best = 0
    for mask in range(1 << n):
        s = 0
        for i in range(n):
            if (mask >> i) & 1:
                s += nums[i]
        if s <= limit:
            best = max(best, s)
    return best
