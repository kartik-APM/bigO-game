import bisect

def common_count(a, sorted_b):
    count = 0
    for x in a:
        i = bisect.bisect_left(sorted_b, x)
        if i < len(sorted_b) and sorted_b[i] == x:
            count += 1
    return count
