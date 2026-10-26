def best_value(weights, values, cap, i=0):
    if i == len(weights):
        return 0
    skip = best_value(weights, values, cap, i + 1)
    if weights[i] > cap:
        return skip
    take = values[i] + best_value(weights, values, cap - weights[i], i + 1)
    return max(skip, take)
