def heaps(a, k, out):
    if k == 1:
        out.append(a[:])
        return
    for i in range(k - 1):
        heaps(a, k - 1, out)
        j = i if k % 2 == 0 else 0
        a[j], a[k - 1] = a[k - 1], a[j]
    heaps(a, k - 1, out)
