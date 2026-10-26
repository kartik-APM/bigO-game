def count_equal_pairs(xs):
    count = 0
    for i in range(len(xs)):
        for j in range(len(xs)):
            if i != j and xs[i] == xs[j]:
                count += 1
    return count
