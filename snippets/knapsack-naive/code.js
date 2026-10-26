function bestValue(weights, values, cap, i = 0) {
  if (i === weights.length) return 0;
  const skip = bestValue(weights, values, cap, i + 1);
  if (weights[i] > cap) return skip;
  const take = values[i] + bestValue(weights, values, cap - weights[i], i + 1);
  return Math.max(skip, take);
}
