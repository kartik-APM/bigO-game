def reverse(items):
    i, j = 0, len(items) - 1
    while i < j:
        items[i], items[j] = items[j], items[i]
        i += 1
        j -= 1
    return items
