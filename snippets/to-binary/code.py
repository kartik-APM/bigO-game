def to_binary(n):
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n & 1))
        n >>= 1
    return "".join(reversed(bits))
