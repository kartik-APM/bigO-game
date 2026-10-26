def swap_ends(items):
    if len(items) > 1:
        items[0], items[-1] = items[-1], items[0]
    return items
