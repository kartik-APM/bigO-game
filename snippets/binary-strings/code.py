def binary_strings(n, prefix="", out=None):
    if out is None:
        out = []
    if len(prefix) == n:
        out.append(prefix)
    else:
        binary_strings(n, prefix + "0", out)
        binary_strings(n, prefix + "1", out)
    return out
