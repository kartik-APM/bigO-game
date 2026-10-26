def prefix_sum(tree, i):
    total = 0
    while i > 0:
        total += tree[i]
        i -= i & -i
    return total
