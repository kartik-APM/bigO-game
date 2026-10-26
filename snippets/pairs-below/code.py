def pairs_below(nums, limit):
    s = sorted(nums)
    i, j = 0, len(s) - 1
    count = 0
    while i < j:
        if s[i] + s[j] < limit:
            count += j - i
            i += 1
        else:
            j -= 1
    return count
