int bestValue(int[] weights, int[] values, int cap, int i) {
    if (i == weights.length) return 0;
    int skip = bestValue(weights, values, cap, i + 1);
    if (weights[i] > cap) return skip;
    int take = values[i] + bestValue(weights, values, cap - weights[i], i + 1);
    return Math.max(skip, take);
}
