def max_subarray_slow(nums):
    best = nums[0]
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            s = 0
            for k in range(i, j + 1):
                s += nums[k]
            best = max(best, s)
    return best
