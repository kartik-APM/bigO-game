def squares_up_to(n):
    out = []
    i = 1
    while i * i <= n:
        out.append(i * i)
        i += 1
    return out
