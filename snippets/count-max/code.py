def count_max(nums):
    best = nums[0]
    for x in nums:
        best = max(best, x)
    count = 0
    for x in nums:
        if x == best:
            count += 1
    return count
