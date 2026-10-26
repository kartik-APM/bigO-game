def weighted_passes(a):
    width = 1
    work = 0
    while width < len(a):
        for i in range(len(a)):
            work += a[i] * width
        width *= 2
    return work
