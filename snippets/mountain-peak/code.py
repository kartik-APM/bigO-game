def peak_index(mountain):
    lo, hi = 0, len(mountain) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mountain[mid] < mountain[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo
