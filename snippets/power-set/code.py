def power_set(items):
    if not items:
        return [[]]
    rest = power_set(items[1:])
    return rest + [[items[0]] + s for s in rest]
