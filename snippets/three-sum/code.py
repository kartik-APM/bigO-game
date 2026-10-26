def has_zero_triple(nums):
    s = sorted(nums)
    for i in range(len(s) - 2):
        lo, hi = i + 1, len(s) - 1
        while lo < hi:
            total = s[i] + s[lo] + s[hi]
            if total == 0:
                return True
            if total < 0:
                lo += 1
            else:
                hi -= 1
    return False
