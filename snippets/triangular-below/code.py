def triangular_up_to(n):
    out = []
    k, t = 1, 1
    while t <= n:
        out.append(t)
        k += 1
        t += k
    return out
