# next_permutation(a) moves a to the next ordering in O(n)
# and returns False after the last one
def count_orderings(a):
    a = sorted(a)
    count = 1
    while next_permutation(a):
        count += 1
    return count
