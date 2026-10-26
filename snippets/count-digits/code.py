def count_digits(n):
    digits = 1
    while n >= 10:
        n //= 10
        digits += 1
    return digits
